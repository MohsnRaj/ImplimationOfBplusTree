import { useState } from "react";
interface Node {
    keys: number[];
    children: Node[];
    isLeaf: boolean;
}


const BplusTree = () => {
    const [root, setRoot] = useState<Node>({ keys: [], children: [], isLeaf: true });
    const [inputKey, setInputKey] = useState<number | null>(null); // State to hold the user input

    // Function to create a new node
    const createNode = (isLeaf: boolean): Node => {
        return {
            keys: [],
            children: [],
            isLeaf,
        };
    };

    // Function to insert a key into the tree
    const insert = (key: number): void => {
        const insertKey = (currentNode: Node, newKey: number): { node: Node; key?: number } => {
            if (currentNode.isLeaf) {
                const keys = [...currentNode.keys, newKey].sort((a, b) => a - b);
                const node: Node = { keys, children: [], isLeaf: true };
    
                if (keys.length > 3) {
                    const middle = Math.floor(keys.length / 2);
                    const leftKeys = keys.slice(0, middle);
                    const rightKeys = keys.slice(middle);
    
                    const leftNode: Node = { keys: leftKeys, children: [], isLeaf: true };
                    const rightNode: Node = { keys: rightKeys, children: [], isLeaf: true };
    
                    return {
                        node: {
                            keys: [rightKeys[0]],
                            children: [leftNode, rightNode],
                            isLeaf: false
                        },
                        key: rightKeys[0]
                    };
                }
    
                return { node };
            }
    
            const childIndex = currentNode.keys.findIndex(k => newKey < k);
            const { node: updatedChild, key: promoteKey } = insertKey(
                currentNode.children[childIndex],
                newKey
            );
    
            const keys = [...currentNode.keys];
            const children = [...currentNode.children];
    
            if (promoteKey) {
                keys.splice(childIndex, 0, promoteKey);
                children[childIndex] = updatedChild;
                children.splice(childIndex + 1, 0, updatedChild.children.pop()!);
            } else {
                children[childIndex] = updatedChild;
            }
    
            if (keys.length > 3) {
                const middle = Math.floor(keys.length / 2);
                // const leftKeys = keys.slice(0, middle);
                const rightKeys = keys.slice(middle);
                // const leftChildren = children.slice(0, middle + 1);
                // const rightChildren = children.slice(middle + 1);
    
                return {
                    node: {
                        keys: [rightKeys.shift()!],
                        children: [createNode(false), createNode(false)],
                        isLeaf: false
                    },
                    key: rightKeys[0]
                };
            }
    
            return { node: { keys, children, isLeaf: false } };
        };
    
        const { node: updatedRoot, key: promotedKey } = insertKey(root, key);
        if (promotedKey) {
            setRoot({
                keys: [promotedKey],
                children: [root, updatedRoot],
                isLeaf: false
            });
        } else {
            setRoot(updatedRoot);
        }
    };
    
    // Function to display the tree structure
  // Function to display the tree structure
  const display = (): string[] => {
    const treeStructure: string[] = [];

    const traverse = (node: Node, depth: number) => {
        if (!treeStructure[depth]) {
            treeStructure[depth] = `Level ${depth} : [${node.keys.join(',')}]`;
        } else {
            treeStructure[depth] += `, [${node.keys.join(',')}]`;
        }

        if (!node.isLeaf) {
            node.children.forEach(child => traverse(child, depth + 1));
        }
    };

    traverse(root, 0);
    return treeStructure.filter(Boolean); // Remove any empty levels
};
  
const handleInsert = () => {
    if (inputKey !== null) {
        insert(inputKey); // Call your insert function with the user-input key
        setInputKey(null); // Reset the input field after insertion
    }
};

  return (
    <div>
    <input
        type="number"
        value={inputKey || ""}
        onChange={(e) => setInputKey(parseInt(e.target.value))}
        placeholder="Enter key"
    />
    <button onClick={handleInsert}>Insert</button>

    {/* Display tree structure */}
    <div>
        {display().map((node, index) => (
            <p key={index}>{node}</p>
        ))}
    </div>
</div>
);
}

export default BplusTree

