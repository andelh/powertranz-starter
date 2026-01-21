const fs = require("node:fs/promises");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const registryPath = path.join(rootDir, "registry.json");
const outputDir = path.join(rootDir, "public", "r");

const readFileContent = async (filePath) => {
  const content = await fs.readFile(filePath, "utf8");
  return content.replace(/\r\n/g, "\n");
};

const buildItemPayload = async (item) => {
  const files = await Promise.all(
    item.files.map(async (file) => {
      const absolutePath = path.join(rootDir, file.path);
      return {
        ...file,
        content: await readFileContent(absolutePath),
      };
    })
  );

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    title: item.title,
    description: item.description,
    files,
    type: item.type,
  };
};

const writeJson = async (filePath, payload) => {
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`);
};

const main = async () => {
  const registry = JSON.parse(await fs.readFile(registryPath, "utf8"));
  await fs.mkdir(outputDir, { recursive: true });
  await writeJson(path.join(outputDir, "registry.json"), registry);

  await Promise.all(
    registry.items.map(async (item) => {
      const payload = await buildItemPayload(item);
      await writeJson(path.join(outputDir, `${item.name}.json`), payload);
    })
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
