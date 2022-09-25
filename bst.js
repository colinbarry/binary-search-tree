/** In-order traversal where `fn` is applied to each node.
 * */
const traverse = (node, fn) => {
  if (node) {
    traverse(node.left, fn);
    fn(node.val);
    traverse(node.right, fn);
  }
}

/** Returns the node with the given value.
*/
const find = (node, val) => {
  while (node) {
    if (node.val === val) {
      return node;
    } else if (val < node.val) {
      node = node.left;
    } else {
      node = node.right
    }
  }
}

/** Returns the node with the maximum value.
 **/
const min = node => {
  return node.left
    ? min(node.left)
    : node
}

/** Returns the successor node, or undefined if no such node exists.
*/
const succ = node => {
  if (node.right) {
    return min(node.right);
  } else {
    let parent = node.parent;
    while (parent && node == parent.right) {
      node = parent;
      parent = parent.parent;
    }

    return parent;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null
  }

  /** Adds a new node with the given value.
   */
  add(val) {
    if (!this.root) {
      this.root = { val };
    } else {
      let node = this.root;
      while (true) {
        if (val === node.val) {
          throw new Error('duplicate key');
        } else if (val < node.val) {
          if (node.left) {
            node = node.left
          } else {
            node.left = { val, parent: node }
            return
          }
        } else {
          if (node.right) {
            node = node.right
          } else {
            node.right = { val, parent: node }
            return
          }
        }
      }
    }
  }

  /** True is a node exists with the given value.
  */
  has(val) {
    return Boolean(find(this.root, val));
  }

  /** Deletes the node with the given value.
  */
  delete(val) {
    const node = find(this.root, val);
    if (!node) {
      return;
    }

    const replaceNode = (prev, next) => {
      if (this.root === prev) {
        this.root = next;
      } else if (prev.parent.left === prev) {
        prev.parent.left = next;
      } else {
        prev.parent.right = next;
      }

      if (next) {
        next.parent = prev.parent;
      }
    }

    if (node.left == null) {
      replaceNode(node, node.right);
    } else if (node.right == null) {
      replaceNode(node, node.left);
    } else {
      const successor = succ(node);
      if (successor === node.right) {
        replaceNode(node, node.right);
        successor.left = node.left;
      } else {
        replaceNode(successor, successor.right);
        replaceNode(node, successor);
        successor.left = node.left;
        successor.right = node.right
      }
    }
  }

  /** Returns the number of nodes in the tree.
  */
  size() {
    const innerSize = node => {
      if (node) {
        return 1 + innerSize(node.left) + innerSize(node.right);
      } else {
        return 0;
      }
    }

    return innerSize(this.root);
  }

  /** Applies the given unary function `fn` to each node, using in-order
   * traversal. 
   */
  iterate(fn) {
    traverse(this.root, fn);
  }
};

module.exports = BinarySearchTree

