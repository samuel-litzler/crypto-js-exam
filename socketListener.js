const Block = require('./Block');

const socketListener = (socket, blockchain) => {
  socket.on('mine', (sender, receiver, qty) => {
    let block = new Block({sender, receiver, qty});
    blockchain.addNewBlock(block);
    console.info(`Block number ${block.index} just mined`)
  })

  socket.on('mine-end', (newChain, host, timestamp) => {    
    console.info(`New block mined by ${host} at \u001b[34m${timestamp}\u001b[0m`)
    blockchain.chain = newChain;
  })

  return socket
}

module.exports = socketListener;