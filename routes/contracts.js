const express = require('express');
const {
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
} = require('../controllers/contractController');

const router = express.Router();

/**
 * @swagger
 * /api/v1/contracts/generate:
 *   post:
 *     summary: Generate OpenZeppelin contract code
 *     tags: [Contracts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [ERC20, ERC721, ERC1155, Governor, Custom]
 *               options:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   symbol:
 *                     type: string
 *                   mintable:
 *                     type: boolean
 *                   burnable:
 *                     type: boolean
 *     responses:
 *       200:
 *         description: Contract code generated
 */
router.post('/generate', generateContract);

/**
 * @swagger
 * /api/v1/contracts/deploy:
 *   post:
 *     summary: Deploy smart contract
 *     tags: [Contracts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               network:
 *                 type: string
 *               contractData:
 *                 type: object
 *               privateKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contract deployed
 */
router.post('/deploy', deployContract);

/**
 * @swagger
 * /api/v1/contracts/verify/oklink:
 *   post:
 *     summary: Verify contract on OKLink
 *     tags: [Contracts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chainShortName:
 *                 type: string
 *               contractData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Verification submitted
 */
router.post('/verify/oklink', verifyContractOKLink);

/**
 * @swagger
 * /api/v1/contracts/verify/oklink/{chainShortName}/{guid}:
 *   get:
 *     summary: Check OKLink verification status
 *     tags: [Contracts]
 *     parameters:
 *       - in: path
 *         name: chainShortName
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: guid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Verification status
 */
router.get('/verify/oklink/:chainShortName/:guid', checkOKLinkVerification);

/**
 * @swagger
 * /api/v1/contracts/verify/etherscan:
 *   post:
 *     summary: Verify contract on Etherscan-like explorers
 *     tags: [Contracts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               network:
 *                 type: string
 *               contractData:
 *                 type: object
 *               apiKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification submitted
 */
router.post('/verify/etherscan', verifyContractEtherscan);

/**
 * @swagger
 * /api/v1/contracts/verify/commands:
 *   post:
 *     summary: Generate verification commands
 *     tags: [Contracts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               network:
 *                 type: string
 *               contractAddress:
 *                 type: string
 *               contractPath:
 *                 type: string
 *               constructorArgs:
 *                 type: array
 *     responses:
 *       200:
 *         description: Commands generated
 */
router.post('/verify/commands', generateVerificationCommands);

/**
 * @swagger
 * /api/v1/contracts/flatten:
 *   post:
 *     summary: Flatten Solidity source code
 *     tags: [Contracts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mainContract:
 *                 type: string
 *               imports:
 *                 type: object
 *     responses:
 *       200:
 *         description: Source code flattened
 */
router.post('/flatten', flattenSourceCode);

/**
 * @swagger
 * /api/v1/contracts/hardhat/config:
 *   post:
 *     summary: Generate Hardhat configuration
 *     tags: [Contracts]
 *     responses:
 *       200:
 *         description: Hardhat config generated
 */
router.post('/hardhat/config', generateHardhatConfig);

/**
 * @swagger
 * /api/v1/contracts/gas/{network}:
 *   get:
 *     summary: Get gas prices for network
 *     tags: [Contracts]
 *     parameters:
 *       - in: path
 *         name: network
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gas prices retrieved
 */
router.get('/gas/:network', getGasPrices);

/**
 * @swagger
 * /api/v1/contracts/dapp/init:
 *   post:
 *     summary: Initialize dApp project
 *     tags: [Contracts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectName:
 *                 type: string
 *               template:
 *                 type: string
 *                 enum: [javascript, typescript]
 *     responses:
 *       200:
 *         description: dApp project initialized
 */
router.post('/dapp/init', initDAppProject);

module.exports = router;