const axios = require('axios');

class ContractVerificationService {
  constructor() {
    this.verifiers = {
      oklink: 'https://www.oklink.com/api/v5/explorer/contract/verify-source-code',
      etherscan: 'https://api.etherscan.io/api',
      polygonscan: 'https://api.polygonscan.com/api',
      bscscan: 'https://api.bscscan.com/api'
    };
  }

  // Verify contract on OKLink
  async verifyOnOKLink(chainShortName, contractData) {
    try {
      const response = await axios.post(this.verifiers.oklink, {
        chainShortName,
        contractAddress: contractData.address,
        contractName: contractData.name,
        sourceCode: contractData.sourceCode,
        codeFormat: 'solidity-single-file',
        compilerVersion: contractData.compilerVersion || 'v0.8.19+commit.7dd6d404',
        optimization: contractData.optimization ? '1' : '0',
        optimizationRuns: contractData.optimizationRuns || '200',
        contractAbi: JSON.stringify(contractData.abi),
        evmVersion: contractData.evmVersion || 'default',
        licenseType: contractData.licenseType || 'MIT'
      });

      return {
        success: true,
        guid: response.data.data[0],
        verifier: 'oklink'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        verifier: 'oklink'
      };
    }
  }

  // Check verification result on OKLink
  async checkOKLinkVerification(chainShortName, guid) {
    try {
      const response = await axios.post('https://www.oklink.com/api/v5/explorer/contract/check-verify-result', {
        chainShortName,
        guid
      });

      return {
        success: true,
        result: response.data.data[0],
        verifier: 'oklink'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        verifier: 'oklink'
      };
    }
  }

  // Verify contract on Etherscan-like explorers
  async verifyOnEtherscan(network, contractData, apiKey) {
    const apiUrl = this.verifiers[`${network}scan`];
    
    try {
      const response = await axios.post(apiUrl, {
        module: 'contract',
        action: 'verifysourcecode',
        contractaddress: contractData.address,
        sourceCode: contractData.sourceCode,
        codeformat: 'solidity-single-file',
        contractname: contractData.name,
        compilerversion: contractData.compilerVersion || 'v0.8.19+commit.7dd6d404',
        optimizationUsed: contractData.optimization ? 1 : 0,
        runs: contractData.optimizationRuns || 200,
        constructorArguements: contractData.constructorArgs || '',
        evmversion: contractData.evmVersion || 'default',
        licenseType: contractData.licenseType || '3', // MIT
        apikey: apiKey
      });

      return {
        success: response.data.status === '1',
        guid: response.data.result,
        verifier: `${network}scan`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        verifier: `${network}scan`
      };
    }
  }

  // Check Etherscan verification status
  async checkEtherscanVerification(network, guid, apiKey) {
    const apiUrl = this.verifiers[`${network}scan`];
    
    try {
      const response = await axios.get(apiUrl, {
        params: {
          module: 'contract',
          action: 'checkverifystatus',
          guid,
          apikey: apiKey
        }
      });

      return {
        success: true,
        result: response.data.result,
        verifier: `${network}scan`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        verifier: `${network}scan`
      };
    }
  }

  // Generate Hardhat verification command
  generateHardhatVerifyCommand(network, contractAddress, constructorArgs = []) {
    const argsString = constructorArgs.length > 0 ? ` --constructor-args ${constructorArgs.join(' ')}` : '';
    return `npx hardhat verify --network ${network} ${contractAddress}${argsString}`;
  }

  // Generate Foundry verification command
  generateFoundryVerifyCommand(network, contractAddress, contractPath, verifierUrl) {
    return `forge verify-contract ${contractAddress} ${contractPath} --verifier oklink --verifier-url ${verifierUrl} --watch`;
  }

  // Flatten Solidity source code
  flattenSourceCode(mainContract, imports) {
    let flattened = '';
    
    // Add all imports first
    for (const importPath in imports) {
      flattened += `// File: ${importPath}\n`;
      flattened += imports[importPath];
      flattened += '\n\n';
    }
    
    // Add main contract
    flattened += `// File: Main Contract\n`;
    flattened += mainContract;
    
    return flattened;
  }
}

module.exports = ContractVerificationService;