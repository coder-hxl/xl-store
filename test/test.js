import xlStore from "../publish/lib/index.mjs";
// const xlStore = require("../publish/lib/index.js");

const myStore = xlStore(
  {
    state: {
      info: {},
    },
    actions: {
      getInfo(id, name, age) {
        this.info = { id, name, age };
      },
      setId(id) {
        this.info.id = id;
      },
    },
  },
  {
    sameValueExecuteWatch: true,
  }
);

function infoCallback(key, value) {
  console.log("watch-info", key, value);
}

myStore.watchEffect("info", infoCallback);

myStore.getInfo(1, "hxl", 18);
myStore.setId(1);

myStore.deleteWatch("info", infoCallback);

myStore.getInfo(2, "code", 18);
