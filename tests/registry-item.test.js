const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const rootDir = path.resolve(__dirname, "..");

test("payment-hooks registry item lists installable files", () => {
  const registryPath = path.join(rootDir, "registry.json");
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  const item = registry.items.find((entry) => entry.name === "payment-hooks");

  assert.ok(item, "payment-hooks registry item is defined");
  assert.ok(Array.isArray(item.files), "payment-hooks registry item has files");
  assert.ok(
    item.dependencies?.includes("axios"),
    "payment-hooks registry item lists axios dependency"
  );

  const expectedTargets = new Set([
    "components/hooks/use-powertranz.ts",
    "app/api/powertranz/auth/route.ts",
    "app/api/powertranz/auth-response/route.ts",
    "app/api/powertranz/capture/route.ts",
    "app/api/powertranz/refund/route.ts",
    "app/api/powertranz/response/route.ts",
    "app/api/powertranz/tokenize/route.ts",
    "app/api/powertranz/zero-dollar-auth/route.ts",
  ]);

  const targetSet = new Set(item.files.map((file) => file.target));
  expectedTargets.forEach((target) => {
    assert.ok(targetSet.has(target), `registry includes ${target}`);
  });

  item.files.forEach((file) => {
    if (!expectedTargets.has(file.target)) {
      return;
    }

    assert.equal(file.type, "registry:file");
    assert.ok(file.path, "registry file path is set");

    const sourcePath = path.join(rootDir, file.path);
    assert.ok(
      fs.existsSync(sourcePath),
      `registry source exists for ${file.path}`
    );
  });
});
