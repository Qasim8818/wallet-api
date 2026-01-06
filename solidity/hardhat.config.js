require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  solidity: '0.8.19',
  paths: {
    sources: './contracts',
    artifacts: '../web/src/artifacts',
    tests: './test',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ganache: {
      chainId: 5777,
      url: 'http://127.0.0.1:7545',
    },
    // Eth side of the bridge
    origin: {
      url: process.env.DEPLOY_ENDPOINT_ORIGIN,
      accounts: [process.env.DEPLOY_ACC_KEY],
    },
    // Harmony side of the bridge
    destination: {
      url: process.env.DEPLOY_ENDPOINT_DESTINATION,
      accounts: [process.env.DEPLOY_ACC_KEY],
    },
  },
};