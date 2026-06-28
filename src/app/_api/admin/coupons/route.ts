import { type NextRequest } from 'next/server';
import { dbQuery } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

async function checkAdmin(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return false;

  const decoded = await verifyJWT(token);
  if (!decoded || decoded.role !== 'admin') return false;

  return true;
}

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await checkAdmin(request);
    if (!isAdmin) {
      return Response.json(
        { success: false, error: 'Access Denied: Admins only' },
        { status: 403 }
      );
    }

    const coupons = dbQuery.getCoupons();
    return Response.json({ success: true, coupons });
  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await checkAdmin(request);
    if (!isAdmin) {
      return Response.json(
        { success: false, error: 'Access Denied: Admins only' },
        { status: 403 }
      );
    }

    const { searchParams } = request.nextUrl;
    const code = searchParams.get('code');

    if (!code) {
      return Response.json(
        { success: false, error: 'Please provide coupon code' },
        { status: 400 }
      );
    }

    dbQuery.deleteCoupon(code.toUpperCase());

    return Response.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
