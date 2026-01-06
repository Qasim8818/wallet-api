class TreeNode {
  constructor(userId, balance) {
    this.userId = userId;
    this.balance = balance;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() { this.root = null; }
  insert(userId, balance) {
    const node = new TreeNode(userId, balance);
    if (!this.root) { this.root = node; return; }
    this._insert(this.root, node);
  }
  _insert(root, node) {
    if (node.balance < root.balance) {
      if (!root.left) root.left = node; else this._insert(root.left, node);
    } else {
      if (!root.right) root.right = node; else this._insert(root.right, node);
    }
  }
  // in-order DFS returns ascending, to get top we can reverse
  dfsInOrder(node = this.root, out = []) {
    if (!node) return out;
    this.dfsInOrder(node.left, out);
    out.push({ userId: node.userId, balance: node.balance });
    this.dfsInOrder(node.right, out);
    return out;
  }
  // BFS
  bfs() {
    const q = []; if (this.root) q.push(this.root);
    const out = [];
    while (q.length) {
      const n = q.shift(); out.push({ userId: n.userId, balance: n.balance });
      if (n.left) q.push(n.left); if (n.right) q.push(n.right);
    }
    return out;
  }
}

module.exports = BST;