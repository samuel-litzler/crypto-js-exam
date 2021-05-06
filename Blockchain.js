const Block = require('./Block');

class Blockchain{
  constructor(io){
    this.io = io;
    this.chain = [this.startGenesisBlock()];
    this.nodes = [];
  }

  /**
   * Commence le block d'initialisation
   * 
   * @return new Block
   */
  startGenesisBlock(){
    return new Block({sender: '', recipient: '', qty: 0});
  }

  /**
   * Récupère le dernier block
   * 
   * @return this.chain[this.chain.length - 1]
   */
  getLastestBlock(){
    return this.chain[this.chain.length - 1];
  }

  /**
   * Récupère le block d'initialistion
   * 
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
    // faire un if 
    this.chain.push(newblock);
    if(this.checkValidity(this.chain)){
      this.io.emit('mine-end', this.chain, this.nodes[0].id, Date.now());
    }else{
      console.log("Erreur du check de la validité")
    }
  }

  /**
   * Vérifie la validité du block
   * 
   * On vérifie que le precedingHash du block actuel est le même que le hash du bloc précédent
   * 
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
   * Ajout un noeud
   * 
   * push le noeud dans le tableau des noeuds
   * 
   * @param node
   */
  addNewNode(node){
    this.nodes.push(node);
  }

  /**
   * Ajout du block d'initialisation
   * 
   * @param block
   */
  setGenesisBlock(block){
    this.chain[0] = block;
  }

  /**
   * Ajout d'un nouveau chain
   * 
   * @param chain
   */
  setNewChain(chain){
    this.chain = chain;
  }
}

module.exports = Blockchain