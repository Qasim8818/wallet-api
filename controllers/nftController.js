const NFTService = require('../services/nftService');
const { successResponse, errorResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

const nftService = new NFTService();

// Set API key
const setApiKey = async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return errorResponse(res, new Error('API key is required'), 400);
    }

    nftService.setApiKey(apiKey);
    
    return successResponse(res, { message: 'API key set successfully' });
  } catch (error) {
    logger.error('Set API key error:', error);
    return errorResponse(res, error, 500);
  }
};

// Create ERC1155 contract
const createContract = async (req, res) => {
  try {
    const contractData = nftService.generateContractData(req.body);
    
    const result = await nftService.createContract(contractData);
    
    if (!result.success) {
      return errorResponse(res, new Error(result.error), 400);
    }

    logger.info(`Contract deployment initiated: ${result.data.result?.id}`);
    return successResponse(res, result.data, 'Contract deployment initiated');
  } catch (error) {
    logger.error('Create contract error:', error);
    return errorResponse(res, error, 500);
  }
};

// Check contract status
const checkContractStatus = async (req, res) => {
  try {
    const { deploymentId } = req.params;
    
    const result = await nftService.checkContractStatus(deploymentId);
    
    if (!result.success) {
      return errorResponse(res, new Error(result.error), 400);
    }

    return successResponse(res, result.data);
  } catch (error) {
    logger.error('Check contract status error:', error);
    return errorResponse(res, error, 500);
  }
};

// Create token type
const createTokenType = async (req, res) => {
  try {
    const tokenTypeData = nftService.generateTokenTypeData(req.body);
    
    const result = await nftService.createTokenType(tokenTypeData);
    
    if (!result.success) {
      return errorResponse(res, new Error(result.error), 400);
    }

    logger.info(`Token type creation initiated: ${result.data.result?.creations?.[0]?.id}`);
    return successResponse(res, result.data, 'Token type creation initiated');
  } catch (error) {
    logger.error('Create token type error:', error);
    return errorResponse(res, error, 500);
  }
};

// Check token type status
const checkTokenTypeStatus = async (req, res) => {
  try {
    const { creationId } = req.params;
    
    const result = await nftService.checkTokenTypeStatus(creationId);
    
    if (!result.success) {
      return errorResponse(res, new Error(result.error), 400);
    }

    return successResponse(res, result.data);
  } catch (error) {
    logger.error('Check token type status error:', error);
    return errorResponse(res, error, 500);
  }
};

// Mint NFT
const mintNFT = async (req, res) => {
  try {
    const mintData = nftService.generateMintData(req.body);
    
    const result = await nftService.mintNFT(mintData);
    
    if (!result.success) {
      return errorResponse(res, new Error(result.error), 400);
    }

    logger.info(`NFT minting initiated: ${result.data.result?.mints?.[0]?.id}`);
    return successResponse(res, result.data, 'NFT minting initiated');
  } catch (error) {
    logger.error('Mint NFT error:', error);
    return errorResponse(res, error, 500);
  }
};

// Check mint status
const checkMintStatus = async (req, res) => {
  try {
    const { mintId } = req.params;
    
    const result = await nftService.checkMintStatus(mintId);
    
    if (!result.success) {
      return errorResponse(res, new Error(result.error), 400);
    }

    return successResponse(res, result.data);
  } catch (error) {
    logger.error('Check mint status error:', error);
    return errorResponse(res, error, 500);
  }
};

// Batch mint NFTs
const batchMint = async (req, res) => {
  try {
    const { contractAddress, tokenTypeId, addresses, chain } = req.body;
    
    if (!contractAddress || !tokenTypeId || !addresses || !Array.isArray(addresses)) {
      return errorResponse(res, new Error('Missing required fields'), 400);
    }

    const result = await nftService.batchMint(contractAddress, tokenTypeId, addresses, chain);
    
    if (!result.success) {
      return errorResponse(res, new Error(result.error), 400);
    }

    logger.info(`Batch minting initiated for ${addresses.length} addresses`);
    return successResponse(res, result.data, 'Batch minting initiated');
  } catch (error) {
    logger.error('Batch mint error:', error);
    return errorResponse(res, error, 500);
  }
};

module.exports = {
  setApiKey,
  createContract,
  checkContractStatus,
  createTokenType,
  checkTokenTypeStatus,
  mintNFT,
  checkMintStatus,
  batchMint
};