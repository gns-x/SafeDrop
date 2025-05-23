import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle WebSocket upgrade requests
  if (request.headers.get('upgrade') === 'websocket') {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/socketio/:path*',
};
