// Connexion des sockets

// Import de de la classe Block
const Block = require('./Block');

const socketListener = async (socket, blockchain) => {
  socket.on('mine', async (transactions, timestamp) => {
    console.log(`Mining new block with \u001b[33m${transactions.length}\u001b[0m transactions`)
    process.env.BREAK = false;
    let block = new Block({transactions}, timestamp);
    blockchain.transactions = [];
    await blockchain.addNewBlock(block);
  })

  socket.on('transaction', (transaction) => {
    blockchain.addNewTransaction(transaction);
  })

  socket.on('mine-end', async (newChain, hash, timestamp) => {    
    process.env.BREAK = true;
    console.log(`New block mined \u001b[32m${hash}\u001b[0m at \u001b[34m${timestamp}\u001b[0m`)
    blockchain.chain = newChain;
    blockchain.setNewChain(newChain);
  })

  return socket
}

module.exports = socketListener;