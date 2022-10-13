const { isMainThread, Worker, workerData } = require("worker_threads");
const SharedRingBuffer = require("./SharedRingBuffer.js");
const fs = require("fs");

if (isMainThread) {
  const shared = new SharedArrayBuffer(116);
  const threads = [
    new Worker(__filename, { workerData: { shared, isProducer: true } }),
    new Worker(__filename, { workerData: { shared, isProducer: true } }),
    new Worker(__filename, { workerData: { shared, isProducer: false } }),
    new Worker(__filename, { workerData: { shared, isProducer: false } }),
  ];
} else {
  const { shared, isProducer } = workerData;
  const ringBuffer = new SharedRingBuffer(shared);

  if (isProducer) {
    const buffer = Buffer.from("Hello, World!\n");
    while (true) {
      ringBuffer.write(buffer);
    }
  } else {
    while (true) {
      const readBytes = ringBuffer.read(20);
      fs.writeSync(1, `Read ${readBytes.length} bytes\n`);
    }
  }
}
