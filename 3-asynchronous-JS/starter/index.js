const fs = require("fs/promises");
const superagent = require("superagent");

/*fs.readFile(`${__dirname}/dog.txt`)
  .then(data => {
    console.log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then(res => {
    console.log(res.body.message);

    return fs.writeFile("dog-img.txt", res.body.message);
  })
  .then(() => {
    console.log("Random dog image saved to file!");
  })
  .catch(err => {
    console.log(err);
  });
*/

const getDogPic = async () => {
  try {
    const data = await fs.readFile(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res1Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
    const imgs = all.map(el => el.body.message);
    console.log(imgs);
    // console.log(res.body.message);
    await fs.writeFile("dog-img.txt", imgs.join("\n"));
    console.log("Random dog images saved to file!");
  } catch (err) {
    console.log(err);
    throw err;
  }

  return "2: READY 🥳";
};

/*
console.log("1: Will get dog pics!");
getDogPic()
  .then(x => {
    console.log(x);
    console.log("3: Done getting dog pics!");
  })
  .catch(err => {
    console.log("ERROR 💥");
  });
*/

(async () => {
  try {
    console.log("1: Will get dog pics!");
    const x = await getDogPic();
    console.log(x);
    console.log("3: Done getting dog pics!");
  } catch (err) {
    console.log("ERROR 💥");
  }
})();
