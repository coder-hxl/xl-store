// const xlStore = require("../src/index.js");

import xlStore from "../src/index";

const test = xlStore({
  state: {
    info: {
      name: "hxl",
      age: 18,
    },
    teachers: [{ name: "why" }, { name: "pink" }],
  },
  actions: {
    getName() {
      return this.info.name;
    },
    setTeachers() {
      test.teachers = [];
    },
  },
});

console.log(test);

// test.watch("info", (value) => {
//   console.log("info", value);
// });

// test.watch("teachers", (value) => {
//   console.log("teachers1", value);
// });

// setTimeout(() => {
//   test.info.name = "code";
// }, 1000);
