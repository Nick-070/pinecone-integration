export async function upsertVectors(client, records) {
  return client.upsert(records);
}

export async function deleteVectors(client, ids) {
  return client.delete(ids);
}