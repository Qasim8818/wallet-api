const express = require('express');
const {
  setApiKey,
  createContract,
  checkContractStatus,
  createTokenType,
  checkTokenTypeStatus,
  mintNFT,
  checkMintStatus,
  batchMint
} = require('../controllers/nftController');

const router = express.Router();

/**
 * @swagger
 * /api/v1/nft/auth:
 *   post:
 *     summary: Set Venly API key
 *     tags: [NFT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               apiKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: API key set successfully
 */
router.post('/auth', setApiKey);

/**
 * @swagger
 * /api/v1/nft/contracts:
 *   post:
 *     summary: Create ERC1155 contract
 *     tags: [NFT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chain:
 *                 type: string
 *                 enum: [MATIC, ETH, AVAX, BSC, ARBITRUM]
 *               name:
 *                 type: string
 *               symbol:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               externalUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contract deployment initiated
 */
router.post('/contracts', createContract);

/**
 * @swagger
 * /api/v1/nft/contracts/{deploymentId}/status:
 *   get:
 *     summary: Check contract deployment status
 *     tags: [NFT]
 *     parameters:
 *       - in: path
 *         name: deploymentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contract status retrieved
 */
router.get('/contracts/:deploymentId/status', checkContractStatus);

/**
 * @swagger
 * /api/v1/nft/token-types:
 *   post:
 *     summary: Create token type (NFT template)
 *     tags: [NFT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chain:
 *                 type: string
 *               contractAddress:
 *                 type: string
 *               creations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     image:
 *                       type: string
 *     responses:
 *       200:
 *         description: Token type creation initiated
 */
router.post('/token-types', createTokenType);

/**
 * @swagger
 * /api/v1/nft/token-types/{creationId}/status:
 *   get:
 *     summary: Check token type creation status
 *     tags: [NFT]
 *     parameters:
 *       - in: path
 *         name: creationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token type status retrieved
 */
router.get('/token-types/:creationId/status', checkTokenTypeStatus);

/**
 * @swagger
 * /api/v1/nft/mint:
 *   post:
 *     summary: Mint NFT
 *     tags: [NFT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contractAddress:
 *                 type: string
 *               chain:
 *                 type: string
 *               tokenTypeId:
 *                 type: string
 *               destinations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: string
 *                     amount:
 *                       type: integer
 *     responses:
 *       200:
 *         description: NFT minting initiated
 */
router.post('/mint', mintNFT);

/**
 * @swagger
 * /api/v1/nft/mint/{mintId}/status:
 *   get:
 *     summary: Check mint status
 *     tags: [NFT]
 *     parameters:
 *       - in: path
 *         name: mintId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mint status retrieved
 */
router.get('/mint/:mintId/status', checkMintStatus);

/**
 * @swagger
 * /api/v1/nft/batch-mint:
 *   post:
 *     summary: Batch mint NFTs to multiple addresses
 *     tags: [NFT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contractAddress:
 *                 type: string
 *               tokenTypeId:
 *                 type: string
 *               addresses:
 *                 type: array
 *                 items:
 *                   oneOf:
 *                     - type: string
 *                     - type: object
 *                       properties:
 *                         address:
 *                           type: string
 *                         amount:
 *                           type: integer
 *               chain:
 *                 type: string
 *     responses:
 *       200:
 *         description: Batch minting initiated
 */
router.post('/batch-mint', batchMint);

module.exports = router;