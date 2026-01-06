class MinHeap {
  constructor() { this.heap = []; }
  size() { return this.heap.length; }
  peek() { return this.heap[0]; }
  push(item) { this.heap.push(item); this._siftUp(this.heap.length - 1); }
  pop() {
    if (!this.heap.length) return null;
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length) { this.heap[0] = last; this._siftDown(0); }
    return top;
  }
  _siftUp(idx) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.heap[parent].balance <= this.heap[idx].balance) break;
      [this.heap[parent], this.heap[idx]] = [this.heap[idx], this.heap[parent]];
      idx = parent;
    }
  }
  _siftDown(idx) {
    const n = this.heap.length;
    while (true) {
      let left = idx * 2 + 1, right = idx * 2 + 2, smallest = idx;
      if (left < n && this.heap[left].balance < this.heap[smallest].balance) smallest = left;
      if (right < n && this.heap[right].balance < this.heap[smallest].balance) smallest = right;
      if (smallest === idx) break;
      [this.heap[smallest], this.heap[idx]] = [this.heap[idx], this.heap[smallest]];
      idx = smallest;
    }
  }
}
module.exports = MinHeap;