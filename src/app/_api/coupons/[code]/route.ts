import { type NextRequest } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const coupon = dbQuery.getCoupon(code.toUpperCase());

    if (!coupon) {
      return Response.json(
        { success: false, error: 'Invalid or expired coupon code' },
        { status: 404 }
      );
    }

    return Response.json({ success: true, coupon });
  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
