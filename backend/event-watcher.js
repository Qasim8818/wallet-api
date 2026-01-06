const Web3 = require('web3');
require('dotenv').config();

const CHSD_ABIJSON = require('./ChainstackDollars.json');
const DCHSD_ABIJSON = require('./DChainstackDollars.json');

const BRIDGE_WALLET = process.env.BRIDGE_WALLET;
const BRIDGE_WALLET_KEY = process.env.BRIDGE_PRIV_KEY;
const ORIGIN_TOKEN_CONTRACT_ADDRESS = process.env.ORIGIN_TOKEN_CONTRACT_ADDRESS;
const DESTINATION_TOKEN_CONTRACT_ADDRESS = process.env.DESTINATION_TOKEN_CONTRACT_ADDRESS;

// Initialize Web3 providers
const originWebSocketProvider = new Web3(process.env.ORIGIN_WSS_ENDPOINT);
const destinationWebSocketProvider = new Web3(process.env.DESTINATION_WSS_ENDPOINT);

// Add accounts to sign transactions
originWebSocketProvider.eth.accounts.wallet.add(BRIDGE_WALLET_KEY);
destinationWebSocketProvider.eth.accounts.wallet.add(BRIDGE_WALLET_KEY);

// Initialize contracts
const originTokenContract = new originWebSocketProvider.eth.Contract(
  CHSD_ABIJSON.abi,
  ORIGIN_TOKEN_CONTRACT_ADDRESS
);

const destinationTokenContract = new destinationWebSocketProvider.eth.Contract(
  DCHSD_ABIJSON.abi,
  DESTINATION_TOKEN_CONTRACT_ADDRESS
);

// Mint tokens on destination chain
const mintTokens = async (provider, contract, amount, address) => {
  try {
    const trx = contract.methods.mint(address, amount);
    const gas = await trx.estimateGas({ from: BRIDGE_WALLET });
    const gasPrice = await provider.eth.getGasPrice();
    const data = trx.encodeABI();
    const nonce = await provider.eth.getTransactionCount(BRIDGE_WALLET);

    const trxData = {
      from: BRIDGE_WALLET,
      to: DESTINATION_TOKEN_CONTRACT_ADDRESS,
      data,
      gas,
      gasPrice,
      nonce,
    };

    console.log('Minting tokens...');
    const receipt = await provider.eth.sendTransaction(trxData);
    console.log(`Mint transaction sent: ${receipt.transactionHash}`);
    console.log(`Explorer: ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`);
  } catch (error) {
    console.error('Error in mintTokens:', error);
    return false;
  }
};

// Transfer tokens on origin chain
const transferTokens = async (provider, contract, amount, address) => {
  try {
    const trx = contract.methods.transfer(address, amount);
    const gas = await trx.estimateGas({ from: BRIDGE_WALLET });
    const gasPrice = await provider.eth.getGasPrice();
    const data = trx.encodeABI();
    const nonce = await provider.eth.getTransactionCount(BRIDGE_WALLET);

    const trxData = {
      from: BRIDGE_WALLET,
      to: ORIGIN_TOKEN_CONTRACT_ADDRESS,
      data,
      gas,
      gasPrice,
      nonce,
    };

    console.log('Transferring tokens...');
    const receipt = await provider.eth.sendTransaction(trxData);
    console.log(`Transfer transaction sent: ${receipt.transactionHash}`);
    console.log(`Explorer: ${process.env.ORIGIN_EXPLORER}${receipt.transactionHash}`);
  } catch (error) {
    console.error('Error in transferTokens:', error);
    return false;
  }
};

// Handle events from origin chain (ETH -> Harmony)
const handleOriginEvent = async (event, destProvider, destContract) => {
  const { from, to, value } = event.returnValues;
  
  if (to.toLowerCase() === BRIDGE_WALLET.toLowerCase()) {
    console.log(`Bridge received ${value} CHSD from ${from}`);
    console.log('Minting equivalent D-CHSD tokens...');
    await mintTokens(destProvider, destContract, value, from);
  }
};

// Handle events from destination chain (Harmony -> ETH)
const handleDestinationEvent = async (event, originProvider, originContract) => {
  const { from, to, value } = event.returnValues;
  
  if (to.toLowerCase() === BRIDGE_WALLET.toLowerCase()) {
    console.log(`Bridge received ${value} D-CHSD from ${from}`);
    console.log('Transferring equivalent CHSD tokens...');
    await transferTokens(originProvider, originContract, value, from);
  }
};

// Start event listeners
const startEventListeners = async () => {
  try {
    console.log('Starting bridge event listeners...');
    
    // Listen to origin chain events
    originTokenContract.events.Transfer({})
      .on('data', async (event) => {
        await handleOriginEvent(event, destinationWebSocketProvider, destinationTokenContract);
      })
      .on('error', (err) => {
        console.error('Origin chain error:', err);
      });

    // Listen to destination chain events
    destinationTokenContract.events.Transfer({})
      .on('data', async (event) => {
        await handleDestinationEvent(event, originWebSocketProvider, originTokenContract);
      })
      .on('error', (err) => {
        console.error('Destination chain error:', err);
      });

    console.log(`Listening for Transfer events on ${ORIGIN_TOKEN_CONTRACT_ADDRESS}`);
    console.log(`Listening for Transfer events on ${DESTINATION_TOKEN_CONTRACT_ADDRESS}`);
    
  } catch (error) {
    console.error('Error starting event listeners:', error);
  }
};

// Start the bridge service
startEventListeners();