import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateEmbeddings } from "./processors/embeddings.js";
import { chunkText } from "./processors/chunker.js";
import { applyUpdates } from "./processors/updater.js";
import { PineconeClient } from "./pinecone/client.js";
import { upsertVectors, deleteVectors } from "./pinecone/vector_ops.js";
import settings from "./config/settings.example.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
const datasetPath = path.join(__dirname, "../data/samples/dataset_sample.json");
const raw = JSON.parse(fs.readFileSync(datasetPath, "utf8"));

const client = new PineconeClient(settings.pinecone);

for (const item of raw) {
const text = item.text;
const chunks = settings.chunking.enabled
? chunkText(text, settings.chunking.size)
: [text];

const embeddings = await generateEmbeddings(chunks);

const records = embeddings.map((vec, i) => ({
id: `${item.url}-${i}`,
values: vec,
metadata: {
...item.metadata,
url: item.url,
chunk_index: i
}
}));

const updatePlan = applyUpdates(records, client.memory);
if (updatePlan.toUpsert.length > 0) {
await upsertVectors(client, updatePlan.toUpsert);
console.log("Upserted:", updatePlan.toUpsert.length);
}

if (updatePlan.toDelete.length > 0) {
await deleteVectors(client, updatePlan.toDelete);
console.log("Deleted:", updatePlan.toDelete.length);
}
}

console.log("Processing complete.");
}

run().catch(console.error);