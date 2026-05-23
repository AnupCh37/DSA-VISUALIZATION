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

export function generateSinglyLinkedListTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const nodes: number[] = [5, 12, 7];

  recordFrame(frames, nodes, [], 'Starting singly linked list traversal.', 1);
  recordFrame(frames, nodes, [0], 'Visiting head node with value 5.', 2);
  recordFrame(frames, nodes, [1], 'Visiting next node with value 12.', 3);
  recordFrame(frames, nodes, [2], 'Visiting tail node with value 7.', 4);

  nodes.splice(1, 0, 9);
  recordFrame(frames, nodes, [1], 'Inserted value 9 after head node.', 5);
  nodes.splice(2, 1);
  recordFrame(frames, nodes, [2], 'Deleted the node that followed the newly inserted node.', 6);

  return frames;
}

export function generateDoublyLinkedListTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const nodes: number[] = [2, 4, 6, 8];

  recordFrame(frames, nodes, [], 'Starting doubly linked list operations.', 1);
  recordFrame(frames, nodes, [0, 1], 'Traversing forward from head through the first two nodes.', 2);
  recordFrame(frames, nodes, [3, 2], 'Traversing backward from tail through the last two nodes.', 3);
  nodes.splice(2, 0, 5);
  recordFrame(frames, nodes, [2], 'Inserted value 5 between 4 and 6.', 4);
  nodes.splice(1, 1);
  recordFrame(frames, nodes, [1], 'Removed the second element from the list.', 5);

  return frames;
}

export function generateCircularLinkedListTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const nodes: number[] = [7, 3, 9];

  recordFrame(frames, nodes, [], 'Starting circular linked list traversal.', 1);
  recordFrame(frames, nodes, [0, 1, 2], 'Visiting nodes in a loop: 7 -> 3 -> 9 -> back to 7.', 2);
  nodes.push(11);
  recordFrame(frames, nodes, [3], 'Inserted value 11 into the circle.', 3);
  nodes.splice(1, 1);
  recordFrame(frames, nodes, [0, 1], 'Deleted the second node, preserving the circle.', 4);

  return frames;
}
