// import ES6 du module sha256 de la librairie crypto-JS
const sha256 = require("crypto-js/sha256");

const difficulty = 2;

class Block {
  constructor(index, data) {
    this.index = index;
    this.timestamp = Date.now();
    this.data = data;
    this.precedingHash = "0";
    this.hash = this.computeHash();
    this.nonce = 0;
  }

  computeHash() {
    return sha256(
      this.index +
        this.timestamp +
        JSON.stringify(this.data) +
        this.precedingHash +
        this.nonce
    ).toString();
  }

  proofOfWork() {
    do {
      this.hash = this.computeHash();
      this.nonce++;
    } while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    );
    console.log("BLOCK HASHED: " + this.hash);
  }
}

module.exports = Block;
