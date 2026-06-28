import { type NextRequest } from 'next/server';
import { dbQuery } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

// Helper to check admin access
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

    const orders = dbQuery.getAllOrders();
    return Response.json({ success: true, orders });
  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAdmin = await checkAdmin(request);
    if (!isAdmin) {
      return Response.json(
        { success: false, error: 'Access Denied: Admins only' },
        { status: 403 }
      );
    }

    const { orderId, status, paymentStatus } = await request.json();

    if (!orderId || !status) {
      return Response.json(
        { success: false, error: 'Please provide orderId and status' },
        { status: 400 }
      );
    }

    dbQuery.updateOrderStatus(orderId, status, paymentStatus);

    return Response.json({ success: true, message: 'Order updated successfully' });
  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
