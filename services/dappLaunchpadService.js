const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class DAppLaunchpadService {
  constructor() {
    this.supportedTemplates = ['javascript', 'typescript'];
    this.supportedNetworks = [
      'ethereum', 'goerli', 'polygonPos', 'polygonAmoy', 
      'polygonZkevm', 'polygonZkevmTestnet'
    ];
  }

  // Initialize new dApp project
  async initProject(projectName, template = 'javascript') {
    return new Promise((resolve, reject) => {
      const command = template === 'typescript' 
        ? `dapp-launchpad init ${projectName} --template typescript`
        : `dapp-launchpad init ${projectName}`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject({
            success: false,
            error: error.message,
            stderr
          });
        } else {
          resolve({
            success: true,
            message: `Project ${projectName} initialized successfully`,
            stdout,
            template
          });
        }
      });
    });
  }

  // Start development environment
  async startDev(projectPath, forkNetwork = null, blockNumber = null) {
    return new Promise((resolve, reject) => {
      let command = 'dapp-launchpad dev';
      
      if (forkNetwork) {
        command += ` -n ${forkNetwork}`;
        if (blockNumber) {
          command += ` -b ${blockNumber}`;
        }
      }

      const process = exec(command, { cwd: projectPath }, (error, stdout, stderr) => {
        if (error) {
          reject({
            success: false,
            error: error.message,
            stderr
          });
        } else {
          resolve({
            success: true,
            message: 'Development environment started',
            stdout,
            forkNetwork,
            blockNumber
          });
        }
      });

      // Return process for potential termination
      resolve({
        success: true,
        message: 'Development environment starting...',
        process
      });
    });
  }

  // Deploy to production
  async deployProduction(projectPath, chainName, deploymentType = 'both') {
    return new Promise((resolve, reject) => {
      let command = `dapp-launchpad deploy -n ${chainName}`;
      
      if (deploymentType === 'contracts') {
        command += ' --only-smart-contracts';
      } else if (deploymentType === 'frontend') {
        command += ' --only-frontend';
      }

      exec(command, { cwd: projectPath }, (error, stdout, stderr) => {
        if (error) {
          reject({
            success: false,
            error: error.message,
            stderr
          });
        } else {
          resolve({
            success: true,
            message: `Deployment to ${chainName} completed`,
            stdout,
            chainName,
            deploymentType
          });
        }
      });
    });
  }

  // Generate environment configuration
  generateEnvConfig(projectName, options = {}) {
    const {
      walletConnectProjectId,
      privateKey,
      rpcUrls = {},
      apiKeys = {}
    } = options;

    const frontendEnv = `# Frontend Environment Variables
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=${walletConnectProjectId || 'your_walletconnect_project_id'}
NEXT_PUBLIC_PROJECT_NAME=${projectName}
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_RPC_URL=${rpcUrls.amoy || 'https://rpc-amoy.polygon.technology'}`;

    const contractsEnv = `# Smart Contracts Environment Variables
PRIVATE_KEY_DEPLOYER=${privateKey || 'your_private_key_here'}

# Optional RPC URLs
ETHEREUM_RPC_URL=${rpcUrls.ethereum || ''}
POLYGON_RPC_URL=${rpcUrls.polygon || ''}
AMOY_RPC_URL=${rpcUrls.amoy || ''}

# Optional API Keys
ETHERSCAN_API_KEY=${apiKeys.etherscan || ''}
POLYGONSCAN_API_KEY=${apiKeys.polygonscan || ''}`;

    return {
      frontend: frontendEnv,
      contracts: contractsEnv
    };
  }

  // Generate project structure info
  getProjectStructure() {
    return {
      structure: {
        'frontend/': {
          description: 'Next.js frontend application',
          files: {
            '.env': 'Environment variables',
            'pages/': 'Next.js pages',
            'components/': 'React components',
            'styles/': 'CSS styles'
          }
        },
        'smart-contracts/': {
          description: 'Hardhat smart contracts',
          files: {
            '.env': 'Environment variables',
            'contracts/': 'Solidity contracts',
            'scripts/': 'Deployment scripts',
            'test/': 'Contract tests'
          }
        }
      },
      commands: {
        init: 'dapp-launchpad init <PROJECT-NAME>',
        initTypescript: 'dapp-launchpad init <PROJECT-NAME> --template typescript',
        dev: 'dapp-launchpad dev',
        devFork: 'dapp-launchpad dev -n <NETWORK>',
        deploy: 'dapp-launchpad deploy -n <CHAIN-NAME>',
        deployContracts: 'dapp-launchpad deploy -n <CHAIN-NAME> --only-smart-contracts',
        deployFrontend: 'dapp-launchpad deploy -n <CHAIN-NAME> --only-frontend'
      }
    };
  }

  // Check if dApp Launchpad is installed
  async checkInstallation() {
    return new Promise((resolve) => {
      exec('dapp-launchpad --version', (error, stdout, stderr) => {
        if (error) {
          resolve({
            installed: false,
            message: 'dApp Launchpad not installed',
            installCommand: 'npm install -g @polygonlabs/dapp-launchpad'
          });
        } else {
          resolve({
            installed: true,
            version: stdout.trim(),
            message: 'dApp Launchpad is installed'
          });
        }
      });
    });
  }
}

module.exports = DAppLaunchpadService;