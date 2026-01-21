const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "public", "r");
const registryOutputPath = path.join(outputDir, "registry.json");
const itemOutputPath = path.join(outputDir, "payment-hooks.json");

test("registry build output is present", () => {
  execFileSync("node", [path.join(rootDir, "scripts", "registry-build.js")], {
    stdio: "inherit",
  });

  assert.ok(
    fs.existsSync(registryOutputPath),
    `Expected registry output at ${registryOutputPath}`
  );
  assert.ok(
    fs.existsSync(itemOutputPath),
    `Expected registry item output at ${itemOutputPath}`
  );

  const registry = JSON.parse(fs.readFileSync(registryOutputPath, "utf8"));
  assert.ok(Array.isArray(registry.items), "registry output includes items");

  const item = JSON.parse(fs.readFileSync(itemOutputPath, "utf8"));
  assert.equal(item.name, "payment-hooks");
  assert.ok(item.files?.length > 0, "registry item output includes files");
});
