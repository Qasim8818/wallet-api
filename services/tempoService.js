const { ethers } = require('ethers');
const TEMPO_CONFIG = require('../config/tempo');

class TempoService {
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(TEMPO_CONFIG.TESTNET.rpcUrl);
    this.config = TEMPO_CONFIG.TESTNET;
  }

  // Fund address with testnet tokens
  async fundAddress(address) {
    try {
      const response = await fetch(this.config.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tempo_fundAddress',
          params: [address],
          id: 1
        })
      });
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fund address: ${error.message}`);
    }
  }

  // Get TIP-20 token balance
  async getTIP20Balance(tokenAddress, userAddress) {
    const contract = new ethers.Contract(
      tokenAddress,
      ['function balanceOf(address) view returns (uint256)'],
      this.provider
    );
    return await contract.balanceOf(userAddress);
  }

  // Transfer TIP-20 tokens
  async transferTIP20(tokenAddress, to, amount, privateKey) {
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const contract = new ethers.Contract(
      tokenAddress,
      ['function transfer(address,uint256) returns (bool)'],
      wallet
    );
    return await contract.transfer(to, amount);
  }

  // Get transaction receipt with Tempo-specific fields
  async getTransactionReceipt(txHash) {
    const receipt = await this.provider.getTransactionReceipt(txHash);
    // Tempo receipts include feeToken and feePayer fields
    return receipt;
  }

  // Estimate gas in stablecoins
  async estimateGasInStablecoin(transaction) {
    const gasEstimate = await this.provider.estimateGas(transaction);
    // Gas is paid in stablecoins on Tempo
    return gasEstimate;
  }
}

module.exports = TempoService;