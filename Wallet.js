class Wallet{
  constructor(address){
    this.address = address;
    this.transactions = [];
    this.qty = 0;
  }
}

module.exports = Wallet;