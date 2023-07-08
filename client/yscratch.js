import * as Y from "yjs";

const root = new Y.Doc();

const nested = new Y.Map();

nested.get("key");
nested.set("key", "value");

root.getArray("toplevelArray");

root.get("toplevelArray").insert(0, [nested]);
console.log(root.get("nested").toJSON());

const array = new Y.Array();

const text = new Y.Text("Im a ytext");

nested.get("key");
nested.set("key", text);

array.insert(0, [nested]);

console.log(root.get("toplevelArray")[0].toJSON());

console.log(nested.toJSON());

// const ymap = new Y.Map();

// ymap.observe(ymapEvent => {
//   ymapEvent.target === ymap; // => true

//   // Find out what changed:
//   // Option 1: A set of keys that changed
//   console.log(ymapEvent.keysChanged); // => Set<strings>
//   // Option 2: Compute the differences
//   ymapEvent.changes.keys; // => Map<string, { action: 'add'|'update'|'delete', oldValue: any}>

//   // sample code.
//   ymapEvent.changes.keys.forEach((change, key) => {
//     if (change.action === "add") {
//       console.log(
//         `Property "${key}" was added. Initial value: "${ymap.get(key)}".`
//       );
//     } else if (change.action === "update") {
//       console.log(
//         `Property "${key}" was updated. New value: "${ymap.get(
//           key
//         )}". Previous value: "${change.oldValue}".`
//       );
//     } else if (change.action === "delete") {
//       console.log(
//         `Property "${key}" was deleted. New value: undefined. Previous value: "${change.oldValue}".`
//       );
//     }
//   });
// });

// ymap.set("key", "value"); // => Property "key" was added. Initial value: "value".
// ymap.set("key", "new"); // => Property "key" was updated. New value: "new". Previous value: "value".
// ymap.delete("key"); // => Property "key" was deleted. New value: undefined. Previous Value: "new".

// setInterval(() => {}, 1000);

// const doc = new Y.Doc();
// const yarray = doc.getArray("my-array");
// const cell = new Y.Map();
// cell.set("exeCount", 0);

// cell.observe(event => {
//   ymapEvent.changes.keys.forEach((change, key) => {
//     console.log(change, key);
//     if (change.action === "update" && key === "exeCount") {
//       console.log(
//         `Property "${key}" was updated. New value: "${ymap.get(
//           key
//         )}". Previous value: "${change.oldValue}".`
//       );
//     }
//   });
// });

// cell.set("exeCount", 1);
// cell.set("exeCount", 2);
// setInterval(() => {
//   cell.set("exeCount", cell.get("exeCount") + 1);
// }, 1000);

// yarray.observe(event => {
//   console.log("yarray was modified");
// });
// // every time a local or remote client modifies yarray, the observer is called
// yarray.insert(0, ["val"]); // => "yarray was modified"
