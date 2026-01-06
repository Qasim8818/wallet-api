// Example usage for ERC1155, Governor, and Custom contracts

// 1. ERC1155 Multi-Token Contract
const erc1155Example = {
  type: 'ERC1155',
  options: {
    name: 'GameAssets',
    mintable: true,
    burnable: true,
    pausable: true,
    supply: true
  }
};

// 2. Governor DAO Contract
const governorExample = {
  type: 'Governor',
  options: {
    name: 'MyDAO',
    votingDelay: '1',        // 1 block
    votingPeriod: '45818',   // ~1 week
    proposalThreshold: '1000000000000000000000', // 1000 tokens
    quorumPercentage: '4',   // 4%
    timelock: true,
    bravo: false
  }
};

// 3. Custom Contract
const customExample = {
  type: 'Custom',
  options: {
    name: 'MyCustomContract',
    license: 'MIT',
    solidity: '^0.8.19',
    imports: [
      '@openzeppelin/contracts/access/Ownable.sol',
      '@openzeppelin/contracts/security/ReentrancyGuard.sol'
    ],
    inheritance: ['Ownable', 'ReentrancyGuard'],
    events: [
      'DataStored(address indexed user, uint256 indexed id, string data)',
      'DataRetrieved(address indexed user, uint256 indexed id)'
    ],
    stateVariables: [
      'mapping(uint256 => string) private data',
      'mapping(address => uint256[]) private userIds',
      'uint256 private nextId'
    ],
    modifiers: [
      'modifier validId(uint256 id) {\n        require(id < nextId, "Invalid ID");\n        _;\n    }'
    ],
    functions: [
      'function storeData(string memory _data) public returns (uint256) {\n        uint256 id = nextId++;\n        data[id] = _data;\n        userIds[msg.sender].push(id);\n        emit DataStored(msg.sender, id, _data);\n        return id;\n    }',
      'function getData(uint256 id) public view validId(id) returns (string memory) {\n        return data[id];\n    }',
      'function getUserIds(address user) public view returns (uint256[] memory) {\n        return userIds[user];\n    }'
    ]
  }
};

module.exports = {
  erc1155Example,
  governorExample,
  customExample
};