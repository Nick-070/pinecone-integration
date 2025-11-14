export class PineconeClient {
constructor(config) {
this.config = config;
this.memory = {}; // in-memory mock store
}

async upsert(vectors) {
for (const v of vectors) {
this.memory[v.id] = v;
}
return { upsertedCount: vectors.length };
}

async delete(ids) {
for (const id of ids) delete this.memory[id];
return { deletedCount: ids.length };
}
}