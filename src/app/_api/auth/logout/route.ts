import { type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const response = Response.json({ success: true, message: 'Logged out successfully' });
  
  response.headers.append(
    'Set-Cookie',
    'token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
  );

  return response;
}
