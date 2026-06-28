import { type NextRequest } from 'next/server';
import { dbQuery } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    let userName = 'Guest User';

    if (token) {
      const decoded = await verifyJWT(token);
      if (decoded && decoded.id) {
        const user = dbQuery.getUserById(decoded.id as string);
        if (user) {
          userName = user.name;
        }
      }
    }

    const { productId, rating, comment, title, imageUrl, videoUrl, customName } = await request.json();

    if (!productId || !rating || !comment || !title) {
      return Response.json(
        { success: false, error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    const finalName = customName || userName;

    const reviewId = dbQuery.createReview({
      product_id: productId,
      user_name: finalName,
      rating: Number(rating),
      comment,
      title,
      image_url: imageUrl,
      video_url: videoUrl,
    });

    return Response.json({ success: true, reviewId });
  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
