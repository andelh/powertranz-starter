const fs = require("node:fs/promises");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const registryPath = path.join(rootDir, "registry.json");
const outputDir = path.join(rootDir, "public", "r");

const SCHEMA_URL = "https://ui.shadcn.com/schema/registry-item.json";

const readFileContent = async (filePath) => {
  const content = await fs.readFile(filePath, "utf8");
  return content.replace(/\r\n/g, "\n");
};

const buildItemPayload = async (item) => {
  const files = await Promise.all(
    item.files.map(async (file) => {
      const absolutePath = path.join(rootDir, file.path);
      try {
        return {
          ...file,
          content: await readFileContent(absolutePath),
        };
      } catch (error) {
        throw new Error(`Failed to read file ${file.path}: ${error.message}`);
      }
    })
  );

  return {
    $schema: SCHEMA_URL,
    name: item.name,
    title: item.title,
    description: item.description,
    type: item.type,
    author: item.author || "PowerTranz",
    categories: item.categories || ["payments", "integrations"],
    docs: item.docs,
    registryDependencies: item.registryDependencies || [],
    dependencies: item.dependencies || [],
    files,
  };
};

const writeJson = async (filePath, payload) => {
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`);
};

const main = async () => {
  console.log("Building shadcn registry...");

  const registry = JSON.parse(await fs.readFile(registryPath, "utf8"));

  await fs.mkdir(outputDir, { recursive: true });
  await writeJson(path.join(outputDir, "registry.json"), registry);
  console.log(`Written: ${path.join(outputDir, "registry.json")}`);

  console.log("Building registry items...");
  for (const item of registry.items) {
    console.log(`  Processing: ${item.name}`);
    const payload = await buildItemPayload(item);
    const itemPath = path.join(outputDir, `${item.name}.json`);
    await writeJson(itemPath, payload);
    console.log(`  Written: ${itemPath}`);
    console.log(`    - dependencies: [${payload.dependencies.join(", ")}]`);
    console.log(`    - registryDependencies: [${payload.registryDependencies.join(", ")}]`);
  }

  console.log("\nRegistry build complete!");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
