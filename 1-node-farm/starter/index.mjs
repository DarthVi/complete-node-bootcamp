// import * as fs from "fs";

//Blocking syncrhnous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written!");

//Non-blocking asyncrhonous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("Error😥");

//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", err => {
//         console.log("Your file has been written 😊");
//       });
//     });
//   });
// });
// console.log("Will read file");
// import { readFile, writeFile } from "fs/promises";

// try {
//   const data1 = await readFile("./txt/start.txt", "utf-8");
//   const data2 = await readFile(`./txt/${data1}.txt`, "utf-8");
//   const data3 = await readFile("./txt/append.txt", "utf-8");
//   await writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8");
// } catch (err) {
//   console.error("Error🔴");
// }
import { createServer } from "http";
import { readFile, writeFile } from "fs/promises";
import url from "url";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = await readFile(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(data);

const server = createServer(async (req, res) => {
  console.log(req.url);

  const pathname = req.url;

  if (pathname === "/" || pathname === "/overview") {
    res.end("This is the OVERVIEW");
  } else if (pathname === "/product") {
    res.end("This is the PRODUCT");
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000");
});
