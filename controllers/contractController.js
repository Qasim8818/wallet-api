const ContractDeploymentService = require('../services/contractDeploymentService');
const ContractVerificationService = require('../services/contractVerificationService');
const HardhatPluginService = require('../services/hardhatPluginService');
const GasEstimationService = require('../services/gasEstimationService');
const DAppLaunchpadService = require('../services/dappLaunchpadService');
const { successResponse, errorResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

const deploymentService = new ContractDeploymentService();
const verificationService = new ContractVerificationService();
const hardhatService = new HardhatPluginService();
const gasService = new GasEstimationService();
const launchpadService = new DAppLaunchpadService();

// Generate OpenZeppelin contract code
const generateContract = async (req, res) => {
  try {
    const { type, options } = req.body;
    
    if (!type || !['ERC20', 'ERC721', 'ERC1155', 'Governor', 'Custom'].includes(type)) {
      return errorResponse(res, new Error('Invalid contract type'), 400);
    }

    const contractCode = deploymentService.generateOpenZeppelinContract(type, options);
    
    return successResponse(res, {
      contractCode,
      type,
      options
    }, 'Contract code generated successfully');
  } catch (error) {
    logger.error('Generate contract error:', error);
    return errorResponse(res, error, 500);
  }
};

// Deploy contract
const deployContract = async (req, res) => {
  try {
    const { network, contractData, privateKey } = req.body;
    
    if (!network || !contractData || !privateKey) {
      return errorResponse(res, new Error('Missing required fields'), 400);
    }

    const deployment = await deploymentService.deployContract(network, contractData, privateKey);
    
    logger.info(`Contract deployed: ${deployment.address} on ${network}`);
    return successResponse(res, deployment, 'Contract deployed successfully');
  } catch (error) {
    logger.error('Deploy contract error:', error);
    return errorResponse(res, error, 500);
  }
};

// Verify contract on OKLink
const verifyContractOKLink = async (req, res) => {
  try {
    const { chainShortName, contractData } = req.body;
    
    if (!chainShortName || !contractData) {
      return errorResponse(res, new Error('Missing required fields'), 400);
    }

    const verification = await verificationService.verifyOnOKLink(chainShortName, contractData);
    
    return successResponse(res, verification, 'Contract verification submitted');
  } catch (error) {
    logger.error('Verify contract error:', error);
    return errorResponse(res, error, 500);
  }
};

// Check OKLink verification status
const checkOKLinkVerification = async (req, res) => {
  try {
    const { chainShortName, guid } = req.params;
    
    const result = await verificationService.checkOKLinkVerification(chainShortName, guid);
    
    return successResponse(res, result);
  } catch (error) {
    logger.error('Check verification error:', error);
    return errorResponse(res, error, 500);
  }
};

// Verify contract on Etherscan-like explorers
const verifyContractEtherscan = async (req, res) => {
  try {
    const { network, contractData, apiKey } = req.body;
    
    if (!network || !contractData || !apiKey) {
      return errorResponse(res, new Error('Missing required fields'), 400);
    }

    const verification = await verificationService.verifyOnEtherscan(network, contractData, apiKey);
    
    return successResponse(res, verification, 'Contract verification submitted');
  } catch (error) {
    logger.error('Verify contract Etherscan error:', error);
    return errorResponse(res, error, 500);
  }
};

// Generate verification commands
const generateVerificationCommands = async (req, res) => {
  try {
    const { network, contractAddress, contractPath, constructorArgs } = req.body;
    
    const commands = {
      hardhat: verificationService.generateHardhatVerifyCommand(network, contractAddress, constructorArgs),
      foundry: verificationService.generateFoundryVerifyCommand(
        network, 
        contractAddress, 
        contractPath, 
        `https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/${network.toUpperCase()}`
      )
    };
    
    return successResponse(res, commands, 'Verification commands generated');
  } catch (error) {
    logger.error('Generate verification commands error:', error);
    return errorResponse(res, error, 500);
  }
};

// Flatten source code
const flattenSourceCode = async (req, res) => {
  try {
    const { mainContract, imports } = req.body;
    
    if (!mainContract) {
      return errorResponse(res, new Error('Main contract code is required'), 400);
    }

    const flattened = verificationService.flattenSourceCode(mainContract, imports || {});
    
    return successResponse(res, { flattenedCode: flattened }, 'Source code flattened');
  } catch (error) {
    logger.error('Flatten source code error:', error);
    return errorResponse(res, error, 500);
  }
};

// Generate Hardhat config
const generateHardhatConfig = async (req, res) => {
  try {
    const { networks, apiKeys, customChains, solidity } = req.body;
    
    const config = hardhatService.generateHardhatConfig({
      solidity,
      networks: networks || {},
      apiKeys: apiKeys || {},
      customChains: customChains || []
    });
    
    return successResponse(res, { config }, 'Hardhat config generated');
  } catch (error) {
    logger.error('Generate Hardhat config error:', error);
    return errorResponse(res, error, 500);
  }
};

// Get gas prices
const getGasPrices = async (req, res) => {
  try {
    const { network } = req.params;
    
    const gasPrices = await gasService.getPolygonGasPrices(network);
    
    return successResponse(res, gasPrices);
  } catch (error) {
    logger.error('Get gas prices error:', error);
    return errorResponse(res, error, 500);
  }
};

// Initialize dApp project
const initDAppProject = async (req, res) => {
  try {
    const { projectName, template } = req.body;
    
    if (!projectName) {
      return errorResponse(res, new Error('Project name is required'), 400);
    }

    const result = await launchpadService.initProject(projectName, template);
    
    return successResponse(res, result, 'dApp project initialized');
  } catch (error) {
    logger.error('Init dApp project error:', error);
    return errorResponse(res, error, 500);
  }
};

module.exports = {
  generateContract,
  deployContract,
  verifyContractOKLink,
  checkOKLinkVerification,
  verifyContractEtherscan,
  generateVerificationCommands,
  flattenSourceCode,
  generateHardhatConfig,
  getGasPrices,
  initDAppProject
};