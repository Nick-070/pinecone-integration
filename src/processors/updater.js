import CryptoJS from "crypto-js";

function checksum(record) {
return CryptoJS.SHA256(JSON.stringify(record)).toString();
}

export function applyUpdates(records, memory) {
const toUpsert = [];
const toDelete = [];

for (const record of records) {
const cs = checksum(record);
if (memory[record.id] !== cs) {
toUpsert.push(record);
memory[record.id] = cs;
}
}

// Demo: no expiration logic
return { toUpsert, toDelete };
}