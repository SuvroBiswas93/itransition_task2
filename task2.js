const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function generateHash(input) {
  return crypto.createHash("sha3-256").update(input).digest("hex");
}
function fileHashing(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return generateHash(fileBuffer);
}

async function hashfiles(folder = "", email = "") {
  if (!(folder && email)) throw new Error("Folder and email can't be empty");

  const files = fs
    .readdirSync(folder)
    .filter((file) => fs.statSync(path.join(folder, file)).isFile());

  if (files.length !== 256) {
    throw new Error(`Expected 256 files, but found ${files.length}`);
  }

  const fileHashes = files.map((file) => fileHashing(path.join(folder, file)));

  const sortedFileHashes = fileHashes.sort();

  const joinedFileHashes = sortedFileHashes.join("");

  const hashPlushMail = joinedFileHashes + email.toLowerCase();

  const resultHash = generateHash(hashPlushMail);

  return resultHash;
}

const folder = "./extracted";
const email = "shuvo.249963@gmail.com";
// Start processing
hashfiles(folder, email)
  .then((hash) => console.log("Final output sha3-256: ", hash))
  .catch((error) => console.error(error));
