# Delivery DSA: A Visual Shortest Path Finder

A clean, interactive web application that visualizes Dijkstra's shortest path algorithm on a city map. This project translates the core logic from a foundational C implementation of Dijkstra's into a full-stack Next.js application with a React-based visual frontend.

## 📍 Project Overview

This project is a web-based, interactive tool that solves a classic logistics problem: finding the shortest route between two points.

Users can click on any two locations on the map to set a "Start" and "End" point. The application then calculates the most efficient route, instantly highlighting the shortest path on the map and displaying the total distance. It serves as a practical, hands-on example of how fundamental Data Structures and Algorithms (DSA) power real-world applications like Google Maps, Uber, and delivery services.

## ✨ Features

Interactive Visual Map: A fully responsive map with clickable locations (nodes) and roads (weighted edges).

Real-time Pathfinding: Clicking the "Find Route" button sends a request to a serverless backend API.

Shortest Path Visualization: The app highlights the nodes and edges of the calculated shortest path in real-time.

Dynamic UI: The interface uses React state to dynamically update styles based on user selection and results.

Route Details: Displays the total distance (weight) of the path and the step-by-step route.

Clear State Management: Includes loading, error, and result states for a smooth user experience.

## 🛠️ Tech Stack

This project combines a C-inspired backend logic with a modern web frontend.

### Frontend:

Next.js (React): For server-side rendering and client-side interactivity.

TypeScript: For type safety.

Tailwind CSS: For all styling, enabling a responsive, utility-first design.

lucide-react: For clean and simple icons.

### Backend:

Next.js API Routes: Serverless functions to handle pathfinding requests.

### Core Logic:

Graph (Adjacency List): The city map is represented as a Map structure (src/lib/pathfinder.ts), acting as an adjacency list.

Dijkstra's Algorithm: The shortest path logic is a TypeScript implementation of Dijkstra's.

Priority Queue (Min-Heap): Used within Dijkstra's to achieve an efficient O(E log V) time complexity, a key upgrade from the C code's O(V^2) array-based search.

## ⚙️ How It Works: From C to the Web

The core of this project is the translation of the logic from the original simplest_path.c file into a modern web architecture.

### 1. The C Code Foundation (The "Brain")

The original C program (simplest_path.c) defined the entire logic:

It built a Graph using structs and an Adjacency List.

It ran Dijkstra's Algorithm to find the shortest path, using arrays to track dist, parent, and sptSet.

It used a Stack to reverse the parent array and print the path in the correct order.

### 2. The Next.js Architecture

This application splits that logic into a client-server model:

Backend (src/lib/pathfinder.ts & src/app/api/find-path/route.ts)

Graph: The AdjList from the C code is now a Map in pathfinder.ts. addEdge() populates this Map.

Dijkstra's: The dijkstra() C function is re-implemented as findShortestPath(). It uses a PriorityQueue class for efficiency instead of the C code's minDistance() loop.

API Route: The route.ts file is a simple wrapper. It receives the start and end nodes from the client, calls findShortestPath(), and returns the path and distance as JSON.

Frontend (src/app/page.tsx)

Visual Map: The nodes and edges are rendered as div elements, with positions hardcoded using Tailwind CSS.

State Management: React's useState hook tracks the startNode, endNode, resultPath, and isLoading state.

API Call: When the "Find Route" button is clicked, fetch() sends a POST request to /api/find-path.

Visualization (The "Magic"):

When the API returns a successful response, the resultPath state is updated (e.g., ['Restaurant', 'Crossroads', 'Gas Station', 'Customer House']).

React automatically re-renders the component.

Helper functions like getNodeClassName() and getEdgeClassName() are called. They check if a node or edge is in the resultPath array.

If a node is in the path, it gets green Tailwind classes (bg-green-600, ring-green-300).

If an edge is in the path, it gets green Tailwind classes (bg-green-500, h-2.5).

This is how the backend logic is visually represented on the frontend.

## 🚀 Getting Started

To run this project locally:

### Clone the repository:

```
git clone [https://github.com/your-username/delivery_dsa.git](https://github.com/your-username/delivery_dsa.git)
cd delivery_dsa
```


### Install dependencies:

```
npm install
```


### Run the development server:

```
npm run dev
```


### Open your browser:
Navigate to http://localhost:3000 to see the application in action.
