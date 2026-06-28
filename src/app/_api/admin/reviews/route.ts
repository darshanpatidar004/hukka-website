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

    const reviews = dbQuery.getAllReviews();
    return Response.json({ success: true, reviews });
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
    const id = searchParams.get('id');

    if (!id) {
      return Response.json(
        { success: false, error: 'Please provide review ID' },
        { status: 400 }
      );
    }

    dbQuery.deleteReview(id);

    return Response.json({ success: true, message: 'Review deleted successfully' });
  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
