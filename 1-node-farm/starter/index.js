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

import slugify from "slugify";

import replaceTemplate from "./modules/replaceTemplate.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempOverview = await readFile(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = await readFile(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = await readFile(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = await readFile(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = createServer(async (req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  }
  //PRODUCT PAGE
  else if (pathname === "/product") {
    const product = dataObj[query.id];
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  }
  //API
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  }
  //NOT FOUND PAGE
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000");
});
