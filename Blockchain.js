const Block = require('./Block');

class Blockchain{
  constructor(io){
    this.io = io;
    this.chain = [this.startGenesisBlock()];
    this.nodes = [];
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
   * Ajout un nouveau block
   * 
   * Si la validité est passée, on envoie le nouveaux block
   * 
   * @param newblock Prend un nouveau block : new Block()
   * @return (checkValid) ? emit : error
   */
  addNewBlock(newblock){
    newblock.precedingHash = this.getLastestBlock().hash;
    newblock.index = this.getLastestBlock().index + 1;
    newblock.timestamp = Date.now();
    newblock.proofOfWork();
    this.chain.push(newblock);
    if(this.checkValidity(this.chain)){
      this.io.emit('mine-end', this.chain, this.nodes[0].id, Date.now());
    }else{
      console.log("Erreur du check de la validité")
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
    this.chain = chain;
  }
}

module.exports = Blockchain