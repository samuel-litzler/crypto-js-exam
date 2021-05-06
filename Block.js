// import ES6 du module sha256 de la librairie crypto-JS
const sha256 = require("crypto-js/sha256");

// Ajustement de la difficulté en fonction de la puissance des noeuds du réseaux
const difficulty = 4;

// Notre classe block va gérer l'instanciation d'un nouveau block
class Block {
  /**
   * Constructeur qui va initialiser toutes les variables pour la construction du block
   * @param {*} data 
   */
  constructor(data) {
    this.index = 0;
    this.timestamp = Date.now();
    this.data = data;
    this.precedingHash = "0";
    this.hash = this.computeHash();
    this.nonce = 0;
  }
/**
 * Génération du hash avec différents paramètres
 * @return hash
 */
  computeHash() {
    return sha256(
      this.index +
        this.timestamp +
        JSON.stringify(this.data) +
        this.precedingHash +
        this.nonce
    ).toString();
  }
/**
 * Vérification de l'authenticité des transactions
 */
 proofOfWork(){
  return new Promise((resolve) => {
    setImmediate(async () => {
      let hash = this.computeHash();
      this.nonce++;
      const dontMine = process.env.BREAK;
      if(dontMine === 'true'){
        console.log('Mining stopped');
        resolve(null);
      }else if(hash.substring(0, difficulty) == Array(difficulty + 1).join("0")){
        resolve(hash);
      }else{
        resolve(await this.proofOfWork());
      }
    })  
  })
}
}

module.exports = Block;
