export async function generateEmbeddings(chunks) {
  // Mock embedding: random 1536-d vector
  return chunks.map(() =>
    Array.from({ length: 128 }, () => Math.random())
  );
}