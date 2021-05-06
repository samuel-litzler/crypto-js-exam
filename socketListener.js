const Block = require('./Block');

const socketListener = async (socket, blockchain) => {
  socket.on('mine', async (sender, receiver, qty) => {
    process.env.BREAK = false;
    let block = new Block({sender, receiver, qty});
    await blockchain.addNewBlock(block);
  })

  socket.on('mine-end', async (newChain, hash, timestamp) => {    
    process.env.BREAK = true;
    console.log(`New block mined by ${hash} at \u001b[34m${timestamp}\u001b[0m`)
    blockchain.chain = newChain;
    blockchain.setNewChain(newChain);
  })

  return socket
}

module.exports = socketListener;