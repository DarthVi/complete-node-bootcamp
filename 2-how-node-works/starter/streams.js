import * as fs from "fs";
import * as http from "http";

const server = http.createServer();

server.on("request", async (req, res) => {
  // Solution 3
  const readable = fs.createReadStream("test-file.txt", "utf-8");
  readable.pipe(res);
  //readableSource.pipe(writableDest)
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening...");
});
