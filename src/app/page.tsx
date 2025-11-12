// This is a Client Component, so we need "use client"
"use client";

import { useState } from 'react';
import Head from 'next/head';
import { MapPin, Check, X, Navigation, Loader2, Play } from 'lucide-react';

/*
 * =====================================================================================
 *
 * DATA CONFIGURATION
 *
 * We store the visual map data here. All styling is 100% Tailwind.
 *
 * =====================================================================================
 */

// These are the coordinates for our visual map, defined as Tailwind classes.
// Using Tailwind's JIT (Just-In-Time) compiler lets us use arbitrary values.
const nodePositions: { [key: string]: string } = {
    'Restaurant': 'top-[50px] left-[50px]',
    'Crossroads': 'top-[150px] left-[250px]',
    'Gas Station': 'top-[50px] left-[450px]',
    'Customer House': 'top-[250px] left-[450px]',
};

// These are the visual edges (roads). We include the Tailwind classes
// for position and rotation directly in the object.
const edgeData: { id: string, source: string, target: string, style: string }[] = [
    // Restaurant -> Crossroads
    { id: 'R-C', source: 'Restaurant', target: 'Crossroads', style: 'top-[75px] left-[170px] w-[224px] rotate-[26.5deg]' },
    // Restaurant -> Gas Station
    { id: 'R-GS', source: 'Restaurant', target: 'Gas Station', style: 'top-[75px] left-[170px] w-[280px] rotate-0' },
    // Crossroads -> Gas Station
    { id: 'C-GS', source: 'Crossroads', target: 'Gas Station', style: 'top-[175px] left-[370px] w-[224px] -rotate-[26.5deg]' },
    // Crossroads -> Customer House
    { id: 'C-CH', source: 'Crossroads', target: 'Customer House', style: 'top-[275px] left-[370px] w-[224px] rotate-[26.5deg]' },
    // Gas Station -> Customer House
    { id: 'GS-CH', source: 'Gas Station', target: 'Customer House', style: 'top-[175px] left-[570px] w-[200px] rotate-90' },
];

/*
 * =====================================================================================
 *
 * REACT COMPONENT
 *
 * =====================================================================================
 */
export default function Home() {
    // --- React State ---
    const [startNode, setStartNode] = useState<string | null>(null);
    const [endNode, setEndNode] = useState<string | null>(null);
    const [resultPath, setResultPath] = useState<string[]>([]);
    const [resultDistance, setResultDistance] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- Event Handlers ---

    const handleNodeClick = (nodeName: string) => {
        if (isLoading) return;
        setError(null);

        if (!startNode) {
            setStartNode(nodeName);
            setEndNode(null);
            setResultPath([]);
            setResultDistance(null);
        } else if (!endNode && nodeName !== startNode) {
            setEndNode(nodeName);
        } else {
            setStartNode(nodeName);
            setEndNode(null);
            setResultPath([]);
            setResultDistance(null);
        }
    };

    const handleFindPath = async () => {
        if (!startNode || !endNode) {
            setError('Please select a start and end location.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResultPath([]);

        try {
            const response = await fetch('/api/find-path', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ start: startNode, end: endNode }),
            });

            if (!response.ok) {
                const res = await response.json();
                throw new Error(res.error || 'Failed to find path');
            }

            const { path, distance } = await response.json();
            
            // *** THIS IS THE KEY ***
            // We update the state with the backend's answer.
            // React will now re-render the UI with new classes.
            setResultPath(path);
            setResultDistance(distance);

        } catch (err: any) {
            setError(err.message);
        }
        setIsLoading(false);
    };

    const handleReset = () => {
        setStartNode(null);
        setEndNode(null);
        setResultPath([]);
        setResultDistance(null);
        setError(null);
        setIsLoading(false);
    };

    // --- Dynamic Styling Helpers (with Tailwind) ---

    // This is the core of the VISUALIZATION.
    // It returns different Tailwind classes based on the current state.
    const getNodeClassName = (nodeName: string) => {
        const baseClasses = 'absolute flex items-center gap-2 p-3 pr-4 rounded-full shadow-lg cursor-pointer font-medium transition-all duration-200 ease-in-out transform hover:scale-105';

        // 1. Path Found
        if (resultPath.includes(nodeName)) {
            if (nodeName === startNode) return `${baseClasses} bg-green-600 text-white ring-4 ring-green-300`;
            if (nodeName === endNode) return `${baseClasses} bg-green-600 text-white ring-4 ring-green-300`;
            return `${baseClasses} bg-green-500 text-white`;
        }
        // 2. Selecting Start
        if (nodeName === startNode) {
            return `${baseClasses} bg-blue-500 text-white ring-4 ring-blue-300`;
        }
        // 3. Selecting End
        if (nodeName === endNode) {
            return `${baseClasses} bg-amber-500 text-white ring-4 ring-amber-300`;
        }
        // 4. Default
        return `${baseClasses} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50`;
    };

    // This determines the style of the roads (edges)
    const getEdgeClassName = (edge: { id: string, source: string, target: string }) => {
        const baseClasses = 'absolute h-1.5 bg-gray-300 origin-top-left transition-all duration-300 ease-in-out z-[-1]';

        // Check if a segment of the path matches this edge
        for (let i = 0; i < resultPath.length - 1; i++) {
            if ((resultPath[i] === edge.source && resultPath[i+1] === edge.target) ||
                (resultPath[i] === edge.target && resultPath[i+1] === edge.source)) {
                // Return highlighted path style
                return `${baseClasses} bg-green-500 h-2.5`;
            }
        }
        return baseClasses; // Default edge style
    };

    // --- JSX Render ---
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex flex-col items-center">
            <Head>
                <title>Delivery DSA - Visual Route Finder</title>
            </Head>

            <main className="flex flex-col items-center w-full max-w-6xl">
                
                <header className="text-center">
                    <h1 className="text-3xl sm:text-5xl font-bold text-gray-800">
                        Delivery DSA: Visual Route-Finder
                    </h1>
                    <p className="text-base sm:text-xl text-gray-600 mt-4">
                        Click two locations to find the shortest delivery path.
                    </p>
                </header>

                <div className="w-full flex flex-col lg:flex-row gap-6 mt-10">

                    {/* --- Left Panel: Map --- */}
                    <div className="flex-grow lg:w-2/3">
                        <div className="relative w-full max-w-3xl h-[400px] border-2 border-gray-300 rounded-lg bg-white shadow-inner-lg overflow-hidden">
                            {/* Render Edges (Roads) */}
                            {edgeData.map((edge) => (
                                <div
                                    key={edge.id}
                                    className={`${getEdgeClassName(edge)} ${edge.style}`}
                                />
                            ))}
                            {/* Render Nodes (Locations) */}
                            {Object.entries(nodePositions).map(([name, positionClasses]) => (
                                <div
                                    key={name}
                                    className={`${getNodeClassName(name)} ${positionClasses}`}
                                    onClick={() => handleNodeClick(name)}
                                >
                                    <MapPin size={18} />
                                    <span>{name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- Right Panel: Controls --- */}
                    <div className="lg:w-1/3 flex flex-col gap-5">
                        <div className="bg-white p-5 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Controls</h2>
                            
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-gray-50 border">
                                    <label className="text-sm font-medium text-gray-500">STARTING POINT</label>
                                    <div className={`text-xl font-semibold ${startNode ? 'text-blue-600' : 'text-gray-400'}`}>
                                        {startNode || 'Select a node'}
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg bg-gray-50 border">
                                    <label className="text-sm font-medium text-gray-500">DESTINATION</label>
                                    <div className={`text-xl font-semibold ${endNode ? 'text-amber-600' : 'text-gray-400'}`}>
                                        {endNode || 'Select a node'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                <button
                                    onClick={handleFindPath}
                                    disabled={isLoading || !startNode || !endNode}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-base font-bold text-white bg-green-600 rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <Play size={20} />
                                    )}
                                    {isLoading ? 'Finding...' : 'Find Route'}
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-base font-bold text-white bg-red-600 rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:bg-red-700"
                                >
                                    <X size={20} />
                                    Reset
                                </button>
                            </div>
                        </div>

                        {/* --- Result Panel --- */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md" role="alert">
                                <p className="font-bold">Error</p>
                                <p>{error}</p>
                            </div>
                        )}
                        
                        {resultDistance !== null && (
                            <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-4 rounded-lg shadow-md" role="alert">
                                <div className="flex items-center gap-3">
                                    <Check size={24} className="text-green-600" />
                                    <div>
                                        <p className="font-bold text-lg">Shortest Distance: {resultDistance}</p>
                                        <p className="text-sm">{resultPath.join(' → ')}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}