const assert = require("assert");
const { once } = require("events");
const Piscina = require("piscina");

// if (!Piscina.isWorkerThread) {
//   const piscina = new Piscina({ filename: __filename });
//   piscina.run(9).then((squreRootOfNine) => {
//     console.log("The squre root of nine is ", squreRootOfNine);
//   });
// }

// module.exports = (num) => Math.sqrt(num);

// if (!Piscina.isWorkerThread) {
//   const piscina = new Piscina({ filename: __filename });
//   for (let i = 0; i < 10_000_000; i++) {
//     piscina.run(i).then((squreRootI) => {
//       assert.ok(typeof squreRootI === "number");
//     });
//   }
// }

if (!Piscina.isWorkerThread) {
  const piscina = new Piscina({ filename: __filename, maxQueue: "auto" });
  (async () => {
    for (let i = 0; i < 10_000_000; i++) {
      if (piscina.queueSize === piscina.options.maxQueue) {
        await once(piscina, "drain");
      }
      piscina.run(i).then((squreRootOfI) => {
        assert.ok(typeof squreRootOfI === "number");
      });
    }
  })();
}

module.exports = (num) => Math.sqrt(num);
