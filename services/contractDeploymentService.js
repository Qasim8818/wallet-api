const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

class ContractDeploymentService {
  constructor() {
    this.providers = {
      ethereum: new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL),
      polygon: new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC_URL),
      bsc: new ethers.providers.JsonRpcProvider(process.env.BSC_RPC_URL),
      tempo: new ethers.providers.JsonRpcProvider('https://rpc.testnet.tempo.xyz')
    };
  }

  // Deploy contract using bytecode and ABI
  async deployContract(network, contractData, privateKey) {
    const provider = this.providers[network];
    const wallet = new ethers.Wallet(privateKey, provider);
    
    const factory = new ethers.ContractFactory(
      contractData.abi,
      contractData.bytecode,
      wallet
    );

    const contract = await factory.deploy(...(contractData.constructorArgs || []));
    await contract.deployed();

    return {
      address: contract.address,
      transactionHash: contract.deployTransaction.hash,
      network
    };
  }

  // Generate OpenZeppelin contract code
  generateOpenZeppelinContract(type, options) {
    const templates = {
      ERC20: this.generateERC20Template(options),
      ERC721: this.generateERC721Template(options),
      ERC1155: this.generateERC1155Template(options),
      Governor: this.generateGovernorTemplate(options),
      Custom: this.generateCustomTemplate(options)
    };

    return templates[type] || null;
  }

  generateERC20Template(options) {
    const {
      name = 'MyToken',
      symbol = 'MTK',
      mintable = false,
      burnable = false,
      pausable = false,
      permit = false
    } = options;

    let imports = ['import "@openzeppelin/contracts/token/ERC20/ERC20.sol";'];
    let inheritance = ['ERC20'];
    let features = '';

    if (mintable) {
      imports.push('import "@openzeppelin/contracts/access/Ownable.sol";');
      inheritance.push('Ownable');
      features += `
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }`;
    }

    if (burnable) {
      imports.push('import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";');
      inheritance.push('ERC20Burnable');
    }

    if (pausable) {
      imports.push('import "@openzeppelin/contracts/security/Pausable.sol";');
      inheritance.push('Pausable');
      features += `
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }`;
    }

    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

${imports.join('\n')}

contract ${name.replace(/\s+/g, '')} is ${inheritance.join(', ')} {
    constructor() ERC20("${name}", "${symbol}") {}${features}
}`;
  }

  generateERC721Template(options) {
    const {
      name = 'MyNFT',
      symbol = 'MNFT',
      mintable = false,
      burnable = false,
      enumerable = false,
      uriStorage = false
    } = options;

    let imports = ['import "@openzeppelin/contracts/token/ERC721/ERC721.sol";'];
    let inheritance = ['ERC721'];
    let features = '';

    if (mintable) {
      imports.push('import "@openzeppelin/contracts/access/Ownable.sol";');
      inheritance.push('Ownable');
      features += `
    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }`;
    }

    if (burnable) {
      imports.push('import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";');
      inheritance.push('ERC721Burnable');
    }

    if (enumerable) {
      imports.push('import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";');
      inheritance.push('ERC721Enumerable');
    }

    if (uriStorage) {
      imports.push('import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";');
      inheritance.push('ERC721URIStorage');
    }

    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

${imports.join('\n')}

contract ${name.replace(/\s+/g, '')} is ${inheritance.join(', ')} {
    constructor() ERC721("${name}", "${symbol}") {}${features}
}`;
  }

  generateERC1155Template(options) {
    const { name = 'MyToken', mintable = false, burnable = false, pausable = false, supply = false } = options;
    
    let imports = ['import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";'];
    let inheritance = ['ERC1155'];
    let features = '';

    if (mintable) {
      imports.push('import "@openzeppelin/contracts/access/Ownable.sol";');
      inheritance.push('Ownable');
      features += `
    function mint(address account, uint256 id, uint256 amount, bytes memory data) public onlyOwner {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }`;
    }

    if (burnable) {
      imports.push('import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";');
      inheritance.push('ERC1155Burnable');
    }

    if (pausable) {
      imports.push('import "@openzeppelin/contracts/security/Pausable.sol";');
      inheritance.push('Pausable');
      features += `
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) internal whenNotPaused override {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }`;
    }

    if (supply) {
      imports.push('import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";');
      inheritance.push('ERC1155Supply');
    }

    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

${imports.join('\n')}

contract ${name.replace(/\s+/g, '')} is ${inheritance.join(', ')} {
    constructor() ERC1155("") {}${features}
}`;
  }

  generateGovernorTemplate(options) {
    const {
      name = 'MyGovernor',
      votingDelay = '1', // 1 block
      votingPeriod = '45818', // 1 week
      proposalThreshold = '0',
      quorumPercentage = '4',
      timelock = false,
      bravo = false
    } = options;

    let imports = [
      'import "@openzeppelin/contracts/governance/Governor.sol";',
      'import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";',
      'import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";',
      'import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";',
      'import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";'
    ];
    
    let inheritance = [
      'Governor',
      'GovernorSettings',
      'GovernorCountingSimple',
      'GovernorVotes',
      'GovernorVotesQuorumFraction'
    ];
    
    let constructorParams = `IVotes _token`;
    let constructorBody = `Governor("${name}")
        GovernorSettings(${votingDelay}, ${votingPeriod}, ${proposalThreshold})
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(${quorumPercentage})`;
    
    let overrides = `
    function votingDelay() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingDelay();
    }

    function votingPeriod() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber) public view override(IGovernor, GovernorVotesQuorumFraction) returns (uint256) {
        return super.quorum(blockNumber);
    }

    function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.proposalThreshold();
    }`;

    if (timelock) {
      imports.push('import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";');
      inheritance.push('GovernorTimelockControl');
      constructorParams += ', TimelockController _timelock';
      constructorBody += '\n        GovernorTimelockControl(_timelock)';
      overrides += `

    function state(uint256 proposalId) public view override(Governor, GovernorTimelockControl) returns (ProposalState) {
        return super.state(proposalId);
    }

    function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description) public override(Governor, IGovernor) returns (uint256) {
        return super.propose(targets, values, calldatas, description);
    }

    function _execute(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor() internal view override(Governor, GovernorTimelockControl) returns (address) {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId) public view override(Governor, GovernorTimelockControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }`;
    }

    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

${imports.join('\n')}

contract ${name.replace(/\s+/g, '')} is ${inheritance.join(', ')} {
    constructor(${constructorParams})
        ${constructorBody}
    {}${overrides}
}`;
  }

  generateCustomTemplate(options) {
    const {
      name = 'CustomContract',
      license = 'MIT',
      solidity = '^0.8.19',
      imports = [],
      inheritance = [],
      stateVariables = [],
      functions = [],
      events = [],
      modifiers = []
    } = options;

    let contract = `// SPDX-License-Identifier: ${license}
pragma solidity ${solidity};

`;
    
    if (imports.length > 0) {
      contract += imports.map(imp => `import "${imp}";`).join('\n') + '\n\n';
    }
    
    contract += `contract ${name.replace(/\s+/g, '')}`;
    
    if (inheritance.length > 0) {
      contract += ` is ${inheritance.join(', ')}`;
    }
    
    contract += ' {\n';
    
    if (events.length > 0) {
      contract += '    // Events\n';
      events.forEach(event => {
        contract += `    event ${event};\n`;
      });
      contract += '\n';
    }
    
    if (stateVariables.length > 0) {
      contract += '    // State variables\n';
      stateVariables.forEach(variable => {
        contract += `    ${variable};\n`;
      });
      contract += '\n';
    }
    
    if (modifiers.length > 0) {
      contract += '    // Modifiers\n';
      modifiers.forEach(modifier => {
        contract += `    ${modifier}\n\n`;
      });
    }
    
    contract += '    constructor() {}\n';
    
    if (functions.length > 0) {
      contract += '\n    // Functions\n';
      functions.forEach(func => {
        contract += `    ${func}\n\n`;
      });
    }
    
    contract += '}';
    
    return contract;
  }
}

module.exports = ContractDeploymentService;