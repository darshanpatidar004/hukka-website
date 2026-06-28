import { type NextRequest } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = dbQuery.getProductBySlug(slug);

    if (!product) {
      return Response.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const reviews = dbQuery.getReviewsByProductId(product.id);

    return Response.json({ success: true, product, reviews });
  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
