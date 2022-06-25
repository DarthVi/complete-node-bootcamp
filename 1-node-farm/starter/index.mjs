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
import { readFile, writeFile } from "fs/promises";

try {
  const data1 = await readFile("./txt/start.txt", "utf-8");
  const data2 = await readFile(`./txt/${data1}.txt`, "utf-8");
  const data3 = await readFile("./txt/append.txt", "utf-8");
  await writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8");
} catch (err) {
  console.error("Error🔴");
}
