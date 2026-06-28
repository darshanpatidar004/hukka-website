import { type NextRequest } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const sort = searchParams.get('sort') || undefined;
    const priceRange = searchParams.get('priceRange') || undefined;

    const products = dbQuery.getProducts({ category, search, sort, priceRange });

    return Response.json({ success: true, products });
  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
