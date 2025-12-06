// utils/lruCache.js
// Simple O(1) LRU cache based on a Map + doubly-linked list.
// Exported as a singleton so all modules share the same cache.

class LRUNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class LRUCache {
    /**
     * @param {number} maxSize – maximum number of entries to keep in memory.
     */
    constructor(maxSize = 500) {
        this.maxSize = maxSize;
        this.map = new Map();          // key → node
        this.head = null;              // most-recent
        this.tail = null;              // least-recent
    }

    _removeNode(node) {
        if (node.prev) node.prev.next = node.next;
        if (node.next) node.next.prev = node.prev;
        if (node === this.head) this.head = node.next;
        if (node === this.tail) this.tail = node.prev;
        node.prev = node.next = null;
    }

    _addToFront(node) {
        node.next = this.head;
        if (this.head) this.head.prev = node;
        this.head = node;
        if (!this.tail) this.tail = node;
    }

    /** Get a value – returns undefined if miss */
    get(key) {
        const node = this.map.get(key);
        if (!node) return undefined;          // cache miss

        // Move accessed node to the front (most-recent)
        this._removeNode(node);
        this._addToFront(node);
        return node.value;
    }

    /** Set a value – handles eviction automatically */
    set(key, value) {
        let node = this.map.get(key);
        if (node) {
            node.value = value;
            this._removeNode(node);
        } else {
            if (this.map.size >= this.maxSize) {
                // Evict the least-recently-used entry (tail)
                const evictKey = this.tail.key;
                this._removeNode(this.tail);
                this.map.delete(evictKey);
            }
            node = new LRUNode(key, value);
            this.map.set(key, node);
        }
        this._addToFront(node);
    }

    /** Delete a key explicitly (e.g., after a write) */
    del(key) {
        const node = this.map.get(key);
        if (!node) return;
        this._removeNode(node);
        this.map.delete(key);
    }

    /** Get current size of cache */
    size() {
        return this.map.size;
    }

    /** Clear entire cache */
    clear() {
        this.map.clear();
        this.head = null;
        this.tail = null;
    }
}

// Export a singleton – all modules share the same in-process cache.
module.exports = new LRUCache(1000);   // 1000 entries max