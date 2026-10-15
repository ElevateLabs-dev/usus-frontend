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

  /*
   * Stay inside BACKEND_URL's path (e.g. never
   * reach the backend's /admin panel): reject
   * "." and ".." and encode each segment so an
   * encoded "/" stays part of one segment.
   */
  if (
    path.some(
      (segment) =>
        segment === "." || segment === "..",
    )
  ) {
    return NextResponse.json(
      { detail: "Invalid path." },
      { status: 400 },
    );
  }

  const targetPath = path
    .map((segment) =>
      encodeURIComponent(segment),
    )
    .join("/");

  const targetUrl =
    `${BACKEND_URL}/${targetPath}${queryString}`;

  const headers = new Headers(
    request.headers,
  );

  headers.delete("host");
  headers.delete("content-length");

  // The API uses bearer tokens; this site's
  // cookies never need to reach the backend.
  headers.delete("cookie");

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

  // Never let the backend set cookies on
  // this site.
  responseHeaders.delete("set-cookie");

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