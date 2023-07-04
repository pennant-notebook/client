// ==> :
// {
//     "cells": [
//         {
//             "id": "dde84f76-05aa-4eab-b596-bd0adc2a5a1f",
//             "type": "code",
//             "text": "emptyasdf\n"
//         },
//         {
//             "id": "d455a10a-ec86-41cf-8ae4-f275782dc960",
//             "type": "markdown",
//             "text": "empty"
//         }
//     ],
//     "output": {}
// }

// ==> :
// {
//     "cells": [
//         {
//             "id": "6eaaba5f-d9cc-4bd0-8180-b1f7c5f8f1ec",
//             "type": "code",
//             "text": "emptyasdf"
//         },
//         {
//             "id": "dbee45e9-31f4-46df-a989-ed1d9f6f437a",
//             "type": "code",
//             "text": "empty"
//         },
//         {
//             "id": "5286da90-fbd9-4727-ad8f-97d409607c12",
//             "type": "code",
//             "text": "empty"
//         },
//         {
//             "id": "795056a7-9fe3-47eb-b8fa-01d5b9349fd0",
//             "type": "code",
//             "text": "empty"
//         }
//     ],
//     "output": {
//         "data": "/box/script.js:1\nempty\n^\n\nReferenceError: empty is not defined\n    at Object.<anonymous> (/box/script.js:1:1)\n    at Module._compile (internal/modules/cjs/loader.js:959:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:995:10)\n    at Module.load (internal/modules/cjs/loader.js:815:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:727:14)\n    at Function.Module.runMain (internal/modules/cjs/loader.js:1047:10)\n    at internal/main/run_main_module.js:17:11\n"
//     }
// }

import * as Y from "yjs";

const OBSERVE_CELLS_YARRAY = false;
const OBSERVE_CELL_CONTENT_YTEXT = false;

const yPrettyPrint = function (ydoc, msg = "") {
  console.log(
    "\n\n==> " + msg + ": \n" + JSON.stringify(ydoc.toJSON(), null, 4) + "\n\n"
  );
};

const mockJsonData = JSON.stringify({
  cells: [
    {
      id: "id1blahblahblah",
      type: "code",
      language: "javascript",
      editorContent: "template code text",
      output: {
        data: "hello world"
      }
    },
    {
      id: "id2blahblahblah",
      type: "markdown",
      editorContent: "template code text"
    }
  ],
  output: {
    data: "output currently just contains the latest execution run with no association with the cell that produced it"
  }
});

export const mockJsonToYDoc = function (json, yDoc) {
  if (!json) json = mockJsonData;
  json = JSON.parse(json);

  const mockDoc = yDoc ? yDoc : new Y.Doc();
  const cellsYArray = mockDoc.getArray("cells");

  if (OBSERVE_CELLS_YARRAY) {
    observability.cellsYArray(cellsYArray);
  }

  for (let obj of json.cells) {
    const cellBodyYMap = new Y.Map();
    const contentYText = new Y.Text(obj.editorContent);

    cellBodyYMap.set("id", obj.id);
    cellBodyYMap.set("editorContent", contentYText);
    cellBodyYMap.set("type", obj.type);

    if (obj.output) {
      const cellOutputYMap = new Y.Map();
      cellOutputYMap.set("data", obj.output.data);
      cellBodyYMap.set("output", cellOutputYMap);
    }
    cellsYArray.push([cellBodyYMap]);
  }

  yPrettyPrint(mockDoc, "last print of mockJsonToYDoc function");

  return mockDoc;
};

const observability = {
  cellContentText: function (contentYText, id) {
    contentYText.observe(event => {
      console.log(
        `Change Detected on cell ${id}  - delta: `,
        event.changes.delta
      );
    });
  },

  cellsArr: function (cellsYArray) {
    cellsYArray.observe(yarrayEvent => {
      console.log(
        "\n\nEvent detected on cellOrderArr - delta: ",
        yarrayEvent.changes.delta
      );
    });
  }
};
