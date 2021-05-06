// import ES6 du module sha256 de la librairie crypto-JS
const sha256 = require("crypto-js/sha256");
// utilisation de la classe block
const Block = require('./Block');

class Blockchain{
  constructor(io){
    this.io = io;
    this.chain = [this.startGenesisBlock()];
    this.nodes = [];
    this.transactions = [];
  }

  /**
   * Initialise le premier block de la chaîne
   * 
   * @return new Block
   */
  startGenesisBlock(){
    return new Block({sender: '', recipient: '', qty: 0});
  }

  /**
   * Retourne le dernier block
   * 
   * @return this.chain[this.chain.length - 1]
   */
  getLastestBlock(){
    return this.chain[this.chain.length - 1];
  }

  /**
   * Retourne le genesis block
   */
  getGenesisBlock(){
    return this.chain[0];
  }

  /**
   * Ajoute une transaction
   */
  addNewTransaction(transaction){
    transaction.id = sha256(JSON.stringify(transaction)).toString();
    this.transactions.push(transaction);
    console.log(`New transaction added, id: \u001b[33m${transaction.id}\u001b[0m`);
  }

  /**
   * Ajout un nouveau block
   * 
   * Si la validité est passée, on envoie le nouveaux block
   * 
   * @param newblock Prend un nouveau block : new Block()
   * @return (checkValid) ? emit : error
   */
   async addNewBlock(newblock){
    newblock.precedingHash = this.getLastestBlock().hash;
    newblock.index = this.getLastestBlock().index + 1;
    newblock.timestamp = Date.now();
    let hash = await newblock.proofOfWork();
    if(hash != null){
      newblock.hash = hash;
      this.chain.push(newblock);
      if(this.checkValidity(this.chain)){
        console.log(`BLOCK ${newblock.index} mined -  \u001b[33m${newblock.hash}\u001b[0m`);
        this.io.emit('mine-end', this.chain, newblock.hash, Date.now());
      }else{
        this.chain.splice(this.chain.length - 1, 1);
      }
    }
  }

  /**
   * Vérifie la validité de la chaîne
   * 
   * On vérifie que le precedingHash du block actuel est le même que le hash du bloc précédent
   * @param chain
   */
  checkValidity(chain) {
    for (let i = 1; i < chain.length; i++) {
        const currentBlock = chain[i];
        const precedingBlock = chain[i - 1];

        // if (currentBlock.hash !== currentBlock.computeHash()) return false;
        if (currentBlock.precedingHash !== precedingBlock.hash) return false;

    }
    return true;
  }

  /**
   * Ajout le noeud dans le tableau des noeuds
   * @param node
   */
  addNewNode(node){
    this.nodes.push(node);
  }

  /**
   * Ajout du block d'initialisation à la premiere (0) position de la chaîne
   * 
   * @param block
   */
  setGenesisBlock(block){
    this.chain[0] = block;
  }

  /**
   * Remplace le chain par la Blockchain
   * 
   * @param chain
   */
  setNewChain(chain){
    if(chain.length > this.chain.length && this.checkValidity(chain)){
      this.chain = chain;
    }
  }

}

module.exports = Blockchain