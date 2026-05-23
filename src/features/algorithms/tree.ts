import type { Snapshot } from '../../types';

const recordFrame = (
  frames: Snapshot[],
  arrayState: number[],
  activeIndices: number[],
  explanation: string,
  currentLine: number,
) => {
  frames.push({
    step: frames.length,
    arrayState: [...arrayState],
    activeIndices: [...activeIndices],
    sortedIndices: [],
    currentLine,
    explanation,
  });
};

export function generateBinaryTreeTraversalsTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const tree = [10, 5, 15, 3, 7, 12, 18];

  recordFrame(frames, tree, [], 'Starting binary tree traversal visualizer.', 1);
  recordFrame(frames, tree, [0, 1, 3], 'Preorder step: visit root 10, then left child 5, then left leaf 3.', 2);
  recordFrame(frames, tree, [3], 'Inorder step: left subtree yields 3.', 3);
  recordFrame(frames, tree, [1], 'Inorder step: visit node 5.', 4);
  recordFrame(frames, tree, [4], 'Inorder step: visit right child 7.', 5);
  recordFrame(frames, tree, [0, 2, 5], 'Postorder step: visit root after children with 10 last.', 6);

  return frames;
}

export function generateBSTInsertSearchDeleteTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const tree = [8, 4, 12, 2, 6, 10, 14];

  recordFrame(frames, tree, [], 'Starting BST insert/search/delete simulation.', 1);
  recordFrame(frames, tree, [6], 'Search for 10 visits node 8 then node 12.', 2);
  recordFrame(frames, tree, [4], 'Inserting 5 between 4 and 6.', 3);
  tree.splice(4, 0, 5);
  recordFrame(frames, tree, [4], 'Deleted node with value 2 as part of a sample delete operation.', 4);

  return frames;
}

export function generateAVLRotationsTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const tree = [20, 10, 30, 5, 15, 25, 35];

  recordFrame(frames, tree, [], 'Starting AVL tree rotation demonstration.', 1);
  recordFrame(frames, tree, [1], 'Left rotation at node 10 to balance the subtree.', 2);
  recordFrame(frames, tree, [0, 1], 'Right rotation at node 20 following the left rotation.', 3);
  recordFrame(frames, tree, [0], 'AVL tree is now balanced.', 4);

  return frames;
}

export function generateBTreeInsertionTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const nodes = [10, 20, 30, 40, 50];

  recordFrame(frames, nodes, [], 'Starting B-tree insertion trace.', 1);
  recordFrame(frames, nodes, [4], 'Inserting 55 into the leaf node.', 2);
  nodes.splice(5, 0, 55);
  recordFrame(frames, nodes, [2, 3], 'Split leaf node and propagate median value upward.', 3);
  recordFrame(frames, nodes, [], 'Completed B-tree insertion with node split.', 4);

  return frames;
}

export function generateRedBlackIntroTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const values = [7, 3, 18, 10, 22];

  recordFrame(frames, values, [], 'Starting red-black tree introduction trace.', 1);
  recordFrame(frames, values, [0], 'Root node is black by definition.', 2);
  recordFrame(frames, values, [1, 2], 'Newly inserted children are red until the tree is balanced.', 3);
  recordFrame(frames, values, [3], 'Perform recoloring or rotations when violations occur.', 4);

  return frames;
}

export function generateHuffmanCodingTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const frequencies = [5, 9, 12, 13, 16, 45];

  recordFrame(frames, frequencies, [], 'Starting Huffman coding frequency combination.', 1);
  recordFrame(frames, frequencies, [0, 1], 'Combine the two smallest frequencies into a subtree.', 2);
  recordFrame(frames, frequencies, [2, 3], 'Combine the next two smallest frequencies.', 3);
  recordFrame(frames, frequencies, [], 'Create the Huffman tree and assign shorter codes to frequent values.', 4);

  return frames;
}
