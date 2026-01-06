const fs = require('fs');
const path = require('path');

class HardhatPluginService {
  constructor() {
    this.supportedChains = {
      ethereum: { chainId: 1, shortName: 'ETH' },
      sepolia: { chainId: 11155111, shortName: 'SEPOLIA_TESTNET' },
      polygon: { chainId: 137, shortName: 'POLYGON' },
      amoy: { chainId: 80002, shortName: 'AMOY_TESTNET' },
      bsc: { chainId: 56, shortName: 'BSC' },
      arbitrum: { chainId: 42161, shortName: 'ARBITRUM' },
      optimism: { chainId: 10, shortName: 'OP' },
      base: { chainId: 8453, shortName: 'BASE' }
    };
  }

  // Generate Hardhat config with OKX plugin
  generateHardhatConfig(options) {
    const {
      solidity = '0.8.19',
      networks = {},
      apiKeys = {},
      customChains = []
    } = options;

    const config = `require("@nomicfoundation/hardhat-toolbox");
require("@okxweb3/hardhat-explorer-verify");
require("dotenv").config();

module.exports = {
  solidity: "${solidity}",
  sourcify: {
    enabled: true,
  },
  networks: {
    ${Object.entries(networks).map(([name, config]) => 
      `${name}: {
      url: "${config.url}",
      accounts: [process.env.PRIVATE_KEY],
    }`
    ).join(',\n    ')}
  },
  etherscan: {
    apiKey: {
      ${Object.entries(apiKeys).map(([network, key]) => 
        `${network}: "${key}"`
      ).join(',\n      ')}
    },
    customChains: [
      ${customChains.map(chain => 
        `{
        network: "${chain.network}",
        chainId: ${chain.chainId},
        urls: {
          apiURL: "${chain.apiURL}",
          browserURL: "${chain.browserURL}",
        }
      }`
      ).join(',\n      ')}
    ]
  },
  okxweb3explorer: {
    customChains: [
      ${customChains.map(chain => 
        `{
        network: "${chain.network}",
        chainId: ${chain.chainId},
        urls: {
          apiURL: "${chain.apiURL}",
          browserURL: "${chain.browserURL}",
        }
      }`
      ).join(',\n      ')}
    ]
  }
};`;

    return config;
  }

  // Generate verification commands
  generateVerificationCommands(network, contractAddress, contractPath, constructorArgs = []) {
    const argsString = constructorArgs.length > 0 ? ` ${constructorArgs.join(' ')}` : '';
    
    return {
      hardhat: `npx hardhat okverify --network ${network} ${contractAddress}`,
      hardhatWithContract: `npx hardhat okverify --network ${network} --contract ${contractPath} ${contractAddress}`,
      hardhatProxy: `npx hardhat okverify --network ${network} --contract ${contractPath} --proxy ${contractAddress}`,
      foundry: `forge verify-contract ${contractAddress} ${contractPath} --verifier oklink --verifier-url https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/${this.getChainShortName(network)} --watch`,
      truffle: `truffle run verify ${contractPath} --network ${network}`
    };
  }

  // Get chain short name for OKLink API
  getChainShortName(network) {
    return this.supportedChains[network]?.shortName || network.toUpperCase();
  }

  // Generate package.json for Hardhat project
  generatePackageJson(projectName) {
    return {
      name: projectName,
      version: "1.0.0",
      scripts: {
        compile: "hardhat compile",
        test: "hardhat test",
        deploy: "hardhat run scripts/deploy.js",
        verify: "hardhat okverify"
      },
      devDependencies: {
        "@nomicfoundation/hardhat-toolbox": "^4.0.0",
        "@okxweb3/hardhat-explorer-verify": "^1.0.0",
        "hardhat": "^2.19.0",
        "dotenv": "^16.0.0"
      }
    };
  }

  // Generate deployment script
  generateDeployScript(contractName, constructorArgs = []) {
    const argsString = constructorArgs.length > 0 ? `, ${constructorArgs.map(arg => `"${arg}"`).join(', ')}` : '';
    
    return `const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const ${contractName} = await hre.ethers.getContractFactory("${contractName}");
  const contract = await ${contractName}.deploy(${argsString.slice(2)});

  await contract.deployed();

  console.log("${contractName} deployed to:", contract.address);
  console.log("Transaction hash:", contract.deployTransaction.hash);
  
  // Auto-verify after deployment
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await contract.deployTransaction.wait(6);
    
    try {
      await hre.run("okverify", {
        address: contract.address,
        network: hre.network.name
      });
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });`;
  }
}

module.exports = HardhatPluginService;