/ utils/bst.js
// A lightweight, generic Binary Search Tree implementation.
// It supports insert, find, and in‑order traversal.

class BSTNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    /** Insert or replace a node */
    insert(key, value) {
        const insertRec = (node) => {
            if (!node) return new BSTNode(key, value);
            if (key < node.key) node.left = insertRec(node.left);
            else if (key > node.key) node.right = insertRec(node.right);
            else node.value = value; // replace existing
            return node;
        };
        this.root = insertRec(this.root);
    }

    /** Find a node by key – returns its value or null */
    find(key) {
        let cur = this.root;
        while (cur) {
            if (key === cur.key) return cur.value;
            cur = key < cur.key ? cur.left : cur.right;
        }
        return null;
    }

    /** In‑order traversal – returns an array of {key,value} */
    inorder() {
        const result = [];
        const walk = (node) => {
            if (!node) return;
            walk(node.left);
            result.push({ key: node.key, value: node.value });
            walk(node.right);
        };
        walk(this.root);
        return result;
    }
}

module.exports = BST;