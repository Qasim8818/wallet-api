// utils/ownerTrie.js – simple case‑insensitive prefix trie

class TrieNode {
    constructor() {
        this.children = {};   // char → TrieNode
        this.isWord = false;
        this.word = null;    // store the full owner string at leaf
    }
}

class OwnerTrie {
    constructor() {
        this.root = new TrieNode();
    }

    /** Insert a whole owner string (e.g., email) */
    insert(owner) {
        let node = this.root;
        const lower = owner.toLowerCase();
        for (const ch of lower) {
            if (!node.children[ch]) node.children[ch] = new TrieNode();
            node = node.children[ch];
        }
        node.isWord = true;
        node.word = owner;   // keep original case
    }

    /** Return up to `limit` owners that start with `prefix` */
    find(prefix, limit = 10) {
        let node = this.root;
        const lower = prefix.toLowerCase();
        for (const ch of lower) {
            if (!node.children[ch]) return [];   // no match
            node = node.children[ch];
        }
        const results = [];
        const dfs = (n) => {
            if (results.length >= limit) return;
            if (n.isWord) results.push(n.word);
            for (const child of Object.values(n.children)) dfs(child);
        };
        dfs(node);
        return results;
    }
}

module.exports = new OwnerTrie();   // singleton for the whole app