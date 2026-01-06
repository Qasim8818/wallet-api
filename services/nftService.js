const axios = require('axios');

class NFTService {
  constructor() {
    this.baseURL = 'https://api.venly.io/api/v3';
    this.supportedChains = ['MATIC', 'ETH', 'AVAX', 'BSC', 'ARBITRUM'];
  }

  // Set API key for authentication
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    this.headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  // Create ERC1155 contract
  async createContract(contractData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/erc1155/contracts/deployments`,
        contractData,
        { headers: this.headers }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  // Check contract deployment status
  async checkContractStatus(deploymentId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/erc1155/contracts/deployments/${deploymentId}`,
        { headers: this.headers }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  // Create token type (NFT template)
  async createTokenType(tokenTypeData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/erc1155/token-types/creations`,
        tokenTypeData,
        { headers: this.headers }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  // Check token type creation status
  async checkTokenTypeStatus(creationId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/erc1155/token-types/creations/${creationId}`,
        { headers: this.headers }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  // Mint NFTs
  async mintNFT(mintData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/erc1155/contracts/deployments`,
        mintData,
        { headers: this.headers }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  // Check mint status
  async checkMintStatus(mintId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/erc1155/tokens/mints/${mintId}`,
        { headers: this.headers }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  // Generate contract deployment data
  generateContractData(options) {
    const {
      chain = 'MATIC',
      name,
      symbol,
      description,
      image,
      externalUrl
    } = options;

    return {
      chain,
      name,
      symbol,
      description,
      image,
      externalUrl
    };
  }

  // Generate token type data
  generateTokenTypeData(options) {
    const {
      chain = 'MATIC',
      contractAddress,
      creations
    } = options;

    return {
      chain,
      contractAddress,
      creations: creations.map(creation => ({
        name: creation.name,
        description: creation.description || '',
        image: creation.image || '',
        attributes: creation.attributes || [],
        animationUrls: creation.animationUrls || []
      }))
    };
  }

  // Generate mint data
  generateMintData(options) {
    const {
      contractAddress,
      chain = 'MATIC',
      tokenTypeId,
      destinations
    } = options;

    return {
      contractAddress,
      chain,
      tokenTypeId: tokenTypeId.toString(),
      destinations: destinations.map(dest => ({
        address: dest.address,
        amount: dest.amount
      }))
    };
  }

  // Batch mint to multiple addresses
  async batchMint(contractAddress, tokenTypeId, addresses, chain = 'MATIC') {
    const destinations = addresses.map(address => ({
      address: typeof address === 'string' ? address : address.address,
      amount: typeof address === 'string' ? 1 : address.amount || 1
    }));

    const mintData = this.generateMintData({
      contractAddress,
      chain,
      tokenTypeId,
      destinations
    });

    return await this.mintNFT(mintData);
  }
}

module.exports = NFTService;