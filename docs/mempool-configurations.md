# Mempool Configurations

Mempool, also known as the memory pool, transaction pool or txpool, is a dynamic, in-memory space for transactions awaiting block inclusion. Rather than a single, unified pool, each node maintains its own transaction pool, collectively constituting the global memory. This constantly changing dataset, containing thousands of pending transactions, represents millions of dollars in flux at any given moment.

## Protocol Configurations

| Protocol | Protocol Availability | Chainstack Availability | Client Configuration | Example |
|----------|----------------------|-------------------------|---------------------|---------|
| Ethereum | Available to everyone | Archive with Debug and trace APIs | 4096 pending transactions | Ethereum txpool_content |
| Polygon | Available to everyone | Archive with Debug and trace APIs | 4096 pending transactions | Polygon txpool_content |
| BNB Smart Chain | Available to everyone | Archive with Debug and trace APIs | 4096 pending transactions | BSC txpool_content |
| Base | Private to Sequencer | N/A | N/A | N/A |
| Avalanche | Available only to validators | Not available on Chainstack | N/A | N/A |
| TON | External messages are available in mempool | Available | | |
| Arbitrum | No mempool. Only Sequencer FIFO | N/A | N/A | N/A |
| zkSync Era | Sequencer only | N/A | N/A | N/A |
| Polygon zkEVM | Sequencer only | N/A | N/A | N/A |
| Optimism | Private to Sequencer | N/A | N/A | N/A |
| Oasis Saphire | Confidential mempool | N/A | N/A | N/A |
| NEAR | No mempool | N/A | N/A | N/A |
| Aurora | No mempool | N/A | N/A | N/A |
| Solana | No mempool | N/A | N/A | N/A |
| Scroll | Publicly available through Sequencer | N/A | N/A | N/A |
| Ronin | Available to everyone | Not available on Chainstack | N/A | N/A |
| Aptos | Available to everyone but there is no transaction stream | Full or archive node deployment | N/A | N/A |
| Gnosis Chain | Available to everyone | On a dedicated node | Any configuration | Gnosis txpool_content |
| Cronos | No mempool. Only Sequencer FIFO | N/A | N/A | N/A |
| Filecoin | Available to everyone | Full node deployment | 20,000 pending messages | Filecoin MpoolPending |
| Sonic | Available to everyone | On a dedicated node | 4096 pending transactions | txpool_* |
| Fantom | Available to everyone | On a dedicated node | 4096 pending transactions | txpool_* |
| TRON | Available to everyone | On a dedicated node | 4096 pending transactions | txpool_* |
| Starknet | Private to Sequencer | N/A | N/A | N/A |
| Tezos | Available to everyone | Full or archive node deployment | 240 blocks | Tezos pending_operations |
| Bitcoin | Available to everyone | Full node deployment | mempool size: 300 MB, mempool tx expiry: 336 hours (14 days) | Bitcoin getrawmempool |

## API Examples

### Ethereum txpool_content
```bash
curl -X POST \
     -H "Content-Type: application/json" \
     --data '{"jsonrpc":"2.0","method":"txpool_content","params":[],"id":1}' \
     YOUR_CHAINSTACK_NODE
```

### Polygon txpool_content
```bash
curl -X POST \
     -H "Content-Type: application/json" \
     --data '{"jsonrpc":"2.0","method":"txpool_content","params":[],"id":1}' \
     YOUR_CHAINSTACK_NODE
```

### BSC txpool_content
```bash
curl -X POST \
     -H "Content-Type: application/json" \
     --data '{"jsonrpc":"2.0","method":"txpool_content","params":[],"id":1}' \
     YOUR_CHAINSTACK_NODE
```

### Gnosis txpool_content
```bash
curl -X POST \
     -H "Content-Type: application/json" \
     --data '{"jsonrpc":"2.0","method":"txpool_content","params":[],"id":1}' \
     YOUR_CHAINSTACK_NODE
```

### Filecoin MpoolPending
```bash
curl -X POST \
     -H "Content-Type: application/json" \
     --data '{ "jsonrpc": "2.0", "method": "Filecoin.MpoolPending", "params": [null], "id": 1 }' \
     YOUR_CHAINSTACK_NODE
```

### Fantom txpool_content
```bash
curl -X POST \
     -H "Content-Type: application/json" \
     --data '{"jsonrpc":"2.0","method":"txpool_content","params":[],"id":1}' \
     YOUR_CHAINSTACK_NODE
```

### Tezos pending_operations
```bash
curl -X GET "YOUR_CHAINSTACK_NODE/chains/main/mempool/pending_operations"
```

### Bitcoin getrawmempool
```bash
curl -X POST \
     -H "Content-Type: application/json" \
     --data '{"jsonrpc": "2.0", "id":"curltest", "method": "getrawmempool", "params": [] }' \
     YOUR_CHAINSTACK_NODE
```