// This is the API endpoint the frontend will call.

// It uses the App Router's `POST` function convention.

import { findShortestPath } from '@/lib/pathfinder';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {

    try {

        const { start, end } = await request.json();

        if (!start || !end) {

            return NextResponse.json({ error: 'Start and end nodes are required.' }, { status: 400 });

        }

        // Run the Dijkstra's algorithm logic from our lib file

        const { path, distance } = findShortestPath(start, end);

        if (!path) {

            return NextResponse.json({ error: 'No path found.' }, { status: 404 });

        }

        // Send the result back to the frontend

        return NextResponse.json({ path, distance });

    } catch (error) {

        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });

    }

}

