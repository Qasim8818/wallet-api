const axios = require('axios');

class GasEstimationService {
  constructor() {
    this.gasStations = {
      polygon: 'https://gasstation.polygon.technology/v2',
      amoy: 'https://gasstation.polygon.technology/amoy',
      zkevmMainnet: 'https://gasstation.polygon.technology/zkevm',
      zkevmCardona: 'https://gasstation.polygon.technology/zkevm/cardona'
    };
  }

  // Get gas prices from Polygon Gas Station
  async getPolygonGasPrices(network = 'polygon') {
    try {
      const url = this.gasStations[network];
      if (!url) {
        throw new Error(`Unsupported network: ${network}`);
      }

      const response = await axios.get(url);
      return {
        success: true,
        network,
        data: {
          safeLow: {
            maxPriorityFee: response.data.safeLow.maxPriorityFee,
            maxFee: response.data.safeLow.maxFee
          },
          standard: {
            maxPriorityFee: response.data.standard.maxPriorityFee,
            maxFee: response.data.standard.maxFee
          },
          fast: {
            maxPriorityFee: response.data.fast.maxPriorityFee,
            maxFee: response.data.fast.maxFee
          },
          estimatedBaseFee: response.data.estimatedBaseFee,
          blockTime: response.data.blockTime,
          blockNumber: response.data.blockNumber
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        network
      };
    }
  }

  // Estimate gas for contract deployment
  async estimateDeploymentGas(contractBytecode, network = 'polygon') {
    try {
      const gasPrices = await this.getPolygonGasPrices(network);
      if (!gasPrices.success) {
        throw new Error(gasPrices.error);
      }

      // Estimate gas units (rough calculation based on bytecode size)
      const bytecodeSize = contractBytecode.length / 2; // Convert hex to bytes
      const estimatedGasUnits = Math.ceil(bytecodeSize * 6.8 + 21000); // Base formula

      const estimates = {
        gasUnits: estimatedGasUnits,
        safeLow: {
          maxFee: gasPrices.data.safeLow.maxFee,
          totalCost: (estimatedGasUnits * gasPrices.data.safeLow.maxFee) / 1e9, // Convert to ETH/MATIC
          totalCostGwei: estimatedGasUnits * gasPrices.data.safeLow.maxFee
        },
        standard: {
          maxFee: gasPrices.data.standard.maxFee,
          totalCost: (estimatedGasUnits * gasPrices.data.standard.maxFee) / 1e9,
          totalCostGwei: estimatedGasUnits * gasPrices.data.standard.maxFee
        },
        fast: {
          maxFee: gasPrices.data.fast.maxFee,
          totalCost: (estimatedGasUnits * gasPrices.data.fast.maxFee) / 1e9,
          totalCostGwei: estimatedGasUnits * gasPrices.data.fast.maxFee
        }
      };

      return {
        success: true,
        network,
        estimates,
        gasPrices: gasPrices.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        network
      };
    }
  }

  // Get recommended gas settings for transaction
  getRecommendedGasSettings(gasPrices, priority = 'standard') {
    const settings = gasPrices.data[priority];
    
    return {
      maxFeePerGas: Math.ceil(settings.maxFee * 1e9), // Convert to wei
      maxPriorityFeePerGas: Math.ceil(settings.maxPriorityFee * 1e9), // Convert to wei
      gasLimit: null, // To be estimated by ethers
      type: 2 // EIP-1559 transaction
    };
  }

  // Format gas prices for display
  formatGasPrices(gasPrices) {
    return {
      network: gasPrices.network,
      blockNumber: gasPrices.data.blockNumber,
      blockTime: `${gasPrices.data.blockTime}s`,
      baseFee: `${gasPrices.data.estimatedBaseFee} gwei`,
      recommendations: {
        safeLow: `${gasPrices.data.safeLow.maxFee.toFixed(2)} gwei`,
        standard: `${gasPrices.data.standard.maxFee.toFixed(2)} gwei`,
        fast: `${gasPrices.data.fast.maxFee.toFixed(2)} gwei`
      }
    };
  }
}

module.exports = GasEstimationService;