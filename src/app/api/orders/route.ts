import { type NextRequest } from 'next/server';
import { dbQuery } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    let userId: string | null = null;

    if (token) {
      const decoded = await verifyJWT(token);
      if (decoded && decoded.id) {
        userId = decoded.id as string;
      }
    }

    const { totalAmount, paymentMethod, address, items } = await request.json();

    if (!totalAmount || !paymentMethod || !address || !items || !items.length) {
      return Response.json(
        { success: false, error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    const orderId = 'ORD_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const paymentStatus = paymentMethod === 'COD' ? 'pending' : 'paid';

    const order = {
      id: orderId,
      user_id: userId,
      total_amount: totalAmount,
      status: 'pending',
      payment_method: paymentMethod,
      payment_status: paymentStatus,
      address,
      items,
    };

    const newOrder = dbQuery.createOrder(order);

    return Response.json({ success: true, order: newOrder });
  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return Response.json(
        { success: false, error: 'Unauthorized: No session token' },
        { status: 401 }
      );
    }

    const decoded = await verifyJWT(token);
    if (!decoded || !decoded.id) {
      return Response.json(
        { success: false, error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    const orders = dbQuery.getOrdersByUserId(decoded.id as string);
    return Response.json({ success: true, orders });
  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
