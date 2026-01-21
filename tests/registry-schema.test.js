const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("path");
const https = require("https");
const test = require("node:test");

const rootDir = path.resolve(__dirname, "..");
const registryPath = path.join(rootDir, "registry.json");

const loadJson = async (filePath) => {
  const contents = await fs.readFile(filePath, "utf8");
  return JSON.parse(contents);
};

const fetchSchema = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
      res.on("error", reject);
    }).on("error", reject);
  });
};

test("registry.json has valid structure", async () => {
  const registry = await loadJson(registryPath);

  assert.ok(registry.$schema, "registry.json should have $schema");
  assert.ok(
    registry.$schema.includes("shadcn"),
    "registry.json should reference shadcn schema"
  );

  assert.ok(registry.name, "registry.json should have name");
  assert.ok(registry.homepage, "registry.json should have homepage");
  assert.ok(Array.isArray(registry.items), "registry.json should have items array");
  assert.ok(registry.items.length > 0, "registry.json should have at least one item");

  const item = registry.items[0];
  assert.ok(item.name, "registry item should have name");
  assert.ok(item.type, "registry item should have type");
  assert.ok(item.description, "registry item should have description");
  assert.ok(Array.isArray(item.files), "registry item should have files array");
  assert.ok(item.files.length > 0, "registry item should have at least one file");

  const hasDependencies = item.dependencies && item.dependencies.length > 0;
  assert.ok(hasDependencies, "registry item should have dependencies");

  const hasRegistryDependencies =
    item.registryDependencies && item.registryDependencies.length > 0;
  assert.ok(
    hasRegistryDependencies,
    "registry item should have registryDependencies"
  );
});

test("registry item files reference existing paths", async () => {
  const registry = await loadJson(registryPath);

  for (const item of registry.items) {
    for (const file of item.files) {
      assert.ok(file.path, "file should have path");
      assert.ok(file.type, "file should have type");

      const absolutePath = path.join(rootDir, file.path);
      const exists = await fs.access(absolutePath).then(() => true).catch(() => false);
      assert.ok(exists, `file path should exist: ${file.path}`);
    }
  }
});
