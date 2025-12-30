"use server";

import { baseApiRequest } from "@/app/utils/apiRequests/baseApiRequest";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";

/**
 * Server-side route handler for child operations
 * Uses baseApiRequest to automatically attach authorization tokens
 * Proxies requests from the frontend to the Spring Boot backend
 */

// POST /api/children - Create a new child
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await baseApiRequest(
      `${BACKEND_URL}/children`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      { isAccessTokenRequird: true }
    );

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating child:", error);
    return NextResponse.json(
      { error: "Failed to create child" },
      { status: 500 }
    );
  }
}

// GET /api/children - Fetch all children
export async function GET(request: NextRequest) {
  try {
    const response = await baseApiRequest(
      `${BACKEND_URL}/children`,
      { method: "GET" },
      { isAccessTokenRequird: true }
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching children:", error);
    return NextResponse.json(
      { error: "Failed to fetch children" },
      { status: 500 }
    );
  }
}
