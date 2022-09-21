import xlStore from "../publish/lib/index.mjs";
// const xlStore = require("../publish/lib/index.js");

const myStore = xlStore({
  state: {
    info: {},
  },
  actions: {
    getInfo(id, name, age) {
      this.info = { id, name, age };
    },
  },
});

function infoCallback(value) {
  console.log("watch-info", value);
}

myStore.watch("info", infoCallback);

myStore.getInfo(1, "hxl", 18);

myStore.deleteWatch("info", infoCallback);

myStore.getInfo(2, "code", 18);
