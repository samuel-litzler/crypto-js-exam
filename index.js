const express = require('express');
const Blockchain = require('./Blockchain');
const Block = require('./Block');

const fetch = require('node-fetch');
const app = express();
const socketListener = require('./socketListener');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const client = require('socket.io-client');


const PORT = process.env.PORT || 3001;

app.use(express.json());

const blockchain = new Blockchain(io);

app.get('/blocks', (req, res) => {
  res.json(blockchain.chain);
})

// on n'utilise plus cette route -> /transaction
// app.post('/mine', (req, res) => {
//   const {sender, receiver, qty} = req.body;
//   io.emit('mine', sender, receiver, qty);
//   // blockchain.addNewBlock(new Block(req.body));
//   res.redirect('/blocks');
// })

app.post('/transaction', (req, res) => {
  const {sender, receiver, qty} = req.body;
  if(blockchain.transactions.length +1 > 2){
    blockchain.addNewTransaction({sender, receiver, qty, timestamp: Date.now()});
    io.emit('mine', blockchain.transactions);
  }else{
    io.emit('transaction', {sender, receiver, qty, timestamp: Date.now()});
  }
  res.json({status: 'Transaction added'})
})

app.post('/nodes', (req, res) => {
  const {host, port, genesisBlock} = req.body;
  const {callback} = req.query;
  const node = `http://${host}:${port}`;
  const socketNode = socketListener(client(node), blockchain);
  blockchain.addNewNode(socketNode);

  if(callback == 'true'){
    blockchain.setGenesisBlock(genesisBlock);
    console.log(`Node ${node} added via callback`);
    res.json({status: 'Added node', node: node, callback: true});
  }else{
    console.log(node);
    fetch(`${node}/nodes?callback=true`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        host: req.hostname,
        port: PORT,
        genesisBlock: blockchain.getGenesisBlock(),
      })
    })
    console.log(`Node ${node} added via callback`);
    res.json({status: 'Added node', node: node, callback: false});
  }

})

app.get('/nodes', (req, res) => {
  res.json({cout: blockchain.nodes.length});
})

io.on('connection', (socket) => {
  console.info(`Socket connected ${socket.id}`);
  socket.on('disconnected', () => {
    console.info(`Socket disconnected ${socket.id}`);
  })
})


blockchain.addNewNode(socketListener(client(`http://localhost:${PORT}`), blockchain));


http.listen(PORT, ()=> {
  console.log('Listening on port: ' + PORT);
})