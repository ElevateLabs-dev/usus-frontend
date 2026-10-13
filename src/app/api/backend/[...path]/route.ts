import { NextRequest, NextResponse } from "next/server";

/*
 * Where the FastAPI backend lives.
 *
 * Set BACKEND_URL in .env.local (or the hosting
 * platform), for example:
 * https://usus-api-utc7.onrender.com/api/v1
 */
const BACKEND_URL =
  process.env.BACKEND_URL ??
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

  /*
   * Keep the body as bytes so it can be sent
   * again if the backend redirects the request.
   */
  const body = hasBody
    ? new Uint8Array(
        await request.arrayBuffer(),
      )
    : undefined;

  const send = (url: string) =>
    fetch(url, {
      method: request.method,
      headers,
      // A fresh copy each time: a sent body
      // cannot be reused.
      body: body ? body.slice() : undefined,
      redirect: "manual",
    });

  let response = await send(targetUrl);

  /*
   * FastAPI redirects "/users" to "/users/"
   * (Next.js removes the trailing slash before
   * the request reaches this proxy). Follow that
   * redirect here, with the body, as long as it
   * stays on the backend.
   */
  if (
    [301, 302, 307, 308].includes(
      response.status,
    )
  ) {
    const location =
      response.headers.get("location");

    const redirectUrl = location
      ? new URL(location, targetUrl)
      : null;

    if (
      redirectUrl &&
      redirectUrl.origin ===
        new URL(BACKEND_URL).origin
    ) {
      response = await send(
        redirectUrl.toString(),
      );
    }
  }

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