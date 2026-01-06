class Graph {
  constructor() { this.adj = new Map(); }
  addNode(id) { if (!this.adj.has(id)) this.adj.set(id, new Map()); }
  addEdge(u, v, w = 1) { this.addNode(u); this.addNode(v); this.adj.get(u).set(v, w); }
  neighbors(u) { return this.adj.get(u) || new Map(); }

  // BFS from start
  bfs(start) {
    const q = [start]; const seen = new Set([start]); const order = [];
    while (q.length) { const u = q.shift(); order.push(u); for (const v of this.neighbors(u).keys()) if (!seen.has(v)) { seen.add(v); q.push(v); } }
    return order;
  }

  // DFS recursive
  dfs(start, seen = new Set(), order = []) {
    if (!this.adj.has(start)) return order;
    seen.add(start); order.push(start);
    for (const v of this.neighbors(start).keys()) if (!seen.has(v)) this.dfs(v, seen, order);
    return order;
  }

  // Dijkstra shortest paths from source
  dijkstra(source) {
    const dist = new Map();
    const prev = new Map();
    const pq = new MinQueue();

    for (const node of this.adj.keys()) { dist.set(node, Infinity); prev.set(node, null); }
    dist.set(source, 0); pq.push({ id: source, dist: 0 });

    while (pq.size()) {
      const { id: u, dist: d } = pq.pop();
      if (d > dist.get(u)) continue;
      for (const [v, w] of this.neighbors(u)) {
        const nd = d + w;
        if (nd < dist.get(v)) { dist.set(v, nd); prev.set(v, u); pq.push({ id: v, dist: nd }); }
      }
    }
    return { dist, prev };
  }
}

// Simple MinQueue using array + sort for clarity (replace with binary heap for perf)
class MinQueue {
  constructor() { this.arr = []; }
  push(item) { this.arr.push(item); this.arr.sort((a,b) => a.dist - b.dist); }
  pop() { return this.arr.shift(); }
  size() { return this.arr.length; }
}

module.exports = { Graph };