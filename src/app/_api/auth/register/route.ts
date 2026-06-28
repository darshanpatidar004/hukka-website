import { type NextRequest } from 'next/server';
import { dbQuery } from '@/lib/db';
import { signJWT } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return Response.json(
        { success: false, error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    const existingUser = dbQuery.getUserByEmail(email);
    if (existingUser) {
      return Response.json(
        { success: false, error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const id = 'u_' + Math.random().toString(36).substr(2, 9);

    const user = {
      id,
      name,
      email,
      password: hashedPassword,
      role: 'user',
      rewards_points: 0,
    };

    dbQuery.createUser(user);

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
