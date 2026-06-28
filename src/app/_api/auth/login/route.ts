import { type NextRequest } from 'next/server';
import { dbQuery } from '@/lib/db';
import { signJWT } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { success: false, error: 'Please provide email and password' },
        { status: 400 }
      );
    }

    const user = dbQuery.getUserByEmail(email);
    if (!user) {
      return Response.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return Response.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = await signJWT({ id: user.id, email: user.email, role: user.role });

    const response = Response.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        rewardsPoints: user.rewards_points,
      },
    });

    response.headers.append(
      'Set-Cookie',
      `token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
    );

    return response;
  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
