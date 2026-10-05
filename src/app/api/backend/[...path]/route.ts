import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  "http://127.0.0.1:8000/api/v1";

async function proxyRequest(
  request: NextRequest,
  path: string[],
) {
  const queryString =
    request.nextUrl.search;

  const targetUrl =
    `${BACKEND_URL}/${path.join("/")}${queryString}`;

  const headers = new Headers(
    request.headers,
  );

  headers.delete("host");
  headers.delete("content-length");

  const hasBody =
    request.method !== "GET" &&
    request.method !== "HEAD";

  const body = hasBody
    ? await request.arrayBuffer()
    : undefined;

  const response = await fetch(
    targetUrl,
    {
      method: request.method,
      headers,
      body,
      redirect: "follow",
    },
  );

  const responseHeaders =
    new Headers(response.headers);

  responseHeaders.delete(
    "content-encoding",
  );

  responseHeaders.delete(
    "content-length",
  );

  return new NextResponse(
    response.body,
    {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    },
  );
}

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  },
) {
  const { path } = await context.params;

  return proxyRequest(
    request,
    path,
  );
}

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  },
) {
  const { path } = await context.params;

  return proxyRequest(
    request,
    path,
  );
}

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  },
) {
  const { path } = await context.params;

  return proxyRequest(
    request,
    path,
  );
}

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  },
) {
  const { path } = await context.params;

  return proxyRequest(
    request,
    path,
  );
}

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  },
) {
  const { path } = await context.params;

  return proxyRequest(
    request,
    path,
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
  });
};