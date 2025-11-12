// This file translates the C code's DSA logic into TypeScript.

// 1. The Graph (from C code's main())

// This is the JavaScript/TS equivalent of the Graph struct and addEdge calls.

// We use a Map for a modern adjacency list.

const cityMap = new Map<string, { node: string, weight: number }[]>();

// Helper to add edges (like the C code's addEdge)

function addEdge(source: string, destination: string, weight: number) {

    if (!cityMap.has(source)) cityMap.set(source, []);

    if (!cityMap.has(destination)) cityMap.set(destination, []);

    cityMap.get(source)!.push({ node: destination, weight });

    cityMap.get(destination)!.push({ node: source, weight }); // Undirected graph

}

// Re-create the graph from the C code's main()

// Restaurant (0), Crossroads (1), Gas Station (2), Customer House (3)

addEdge('Restaurant', 'Crossroads', 4);

addEdge('Restaurant', 'Gas Station', 8);

addEdge('Crossroads', 'Gas Station', 2);

addEdge('Crossroads', 'Customer House', 10);

addEdge('Gas Station', 'Customer House', 5);

// 2. The Priority Queue (Min-Heap)

// This is a major upgrade from the C code's minDistance() function (O(V)).

// Using a Priority Queue makes finding the next node O(log V),

// speeding up the whole algorithm from O(V^2) to O(E log V).

class PriorityQueue {

    private nodes: { key: string, priority: number }[] = [];

    enqueue(priority: number, key: string) {

        this.nodes.push({ key, priority });

        this.sort();

    }

    dequeue() {

        return this.nodes.shift();

    }

    sort() {

        this.nodes.sort((a, b) => a.priority - b.priority);

    }

    isEmpty() {

        return !this.nodes.length;

    }

}

// 3. Dijkstra's Algorithm

// This is the TypeScript translation of the C dijkstra() function.

export function findShortestPath(startNode: string, endNode: string) {

    const distances: { [key: string]: number } = {};

    const parents: { [key: string]: string | null } = {};

    const pq = new PriorityQueue();

    const visited = new Set<string>();

    // Initialize distances (like the C code's init loop)

    for (const node of cityMap.keys()) {

        distances[node] = node === startNode ? 0 : Infinity;

        parents[node] = null;

    }

    pq.enqueue(0, startNode);

    while (!pq.isEmpty()) {

        const dequeued = pq.dequeue();

        if (!dequeued) break;

        

        const { key: currentNode, priority: currentDistance } = dequeued;

        if (visited.has(currentNode)) continue;

        visited.add(currentNode);

        // Found the path. Now, reconstruct it.

        // This replaces the C code's getPath() and Stack.

        if (currentNode === endNode) {

            const path: string[] = [];

            let current: string | null = endNode;

            while (current !== null) {

                path.push(current);

                current = parents[current];

            }

            // The C stack built it in order. Our array is reversed, so we fix it.

            return { path: path.reverse(), distance: distances[endNode] };

        }

        // This loop is the equivalent of iterating the AdjListNode* pCrawl

        if (cityMap.has(currentNode)) {

            for (const neighbor of cityMap.get(currentNode)!) {

                if (!visited.has(neighbor.node)) {

                    const newDist = currentDistance + neighbor.weight;

                    if (newDist < distances[neighbor.node]) {

                        distances[neighbor.node] = newDist;

                        parents[neighbor.node] = currentNode;

                        pq.enqueue(newDist, neighbor.node);

                    }

                }

            }

        }

    }

    // No path found

    return { path: null, distance: Infinity };

}

// 4. Export the Graph Data

// The frontend will need this to know what nodes and edges to render.

export const getGraphData = () => {

    const nodes = Array.from(cityMap.keys());

    const edges: { id: string, source: string, target: string, weight: number }[] = [];

    const addedEdges = new Set<string>();

    for (const [source, neighbors] of cityMap.entries()) {

        for (const neighbor of neighbors) {

            const edgeId1 = `${source}-${neighbor.node}`;

            const edgeId2 = `${neighbor.node}-${source}`;

            if (!addedEdges.has(edgeId1) && !addedEdges.has(edgeId2)) {

                edges.push({ id: edgeId1, source, target: neighbor.node, weight: neighbor.weight });

                addedEdges.add(edgeId1);

            }

        }

    }

    return { nodes, edges };

};

