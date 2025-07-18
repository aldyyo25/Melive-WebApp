import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate API response
  return NextResponse.json({
    success: true,
    data: [
      {
        id: '1',
        name: 'Heart',
        icon_url: '/gifts/heart.png',
        animation_file: '/gifts/heart.mp4',
        price_in_credit: '100',
        price_in_diamond: '10',
        created_at: '2025-07-04 09:19:02',
        updated_at: '2025-07-04 09:52:25',
        deleted_at: null,
      },
      {
        id: '2',
        name: 'Star',
        icon_url: '/gifts/star.png',
        animation_file: '/gifts/star.mp4',
        price_in_credit: '500',
        price_in_diamond: '50',
        created_at: '2025-07-04 09:19:02',
        updated_at: '2025-07-04 09:52:25',
        deleted_at: null,
      },
      {
        id: '3',
        name: 'Crown',
        icon_url: '/gifts/crown.png',
        animation_file: '/gifts/crown.mp4',
        price_in_credit: '1000',
        price_in_diamond: '100',
        created_at: '2025-07-04 09:19:02',
        updated_at: '2025-07-04 09:52:25',
        deleted_at: null,
      },
      {
        id: '4',
        name: 'Diamond',
        icon_url: '/gifts/diamond.png',
        animation_file: '/gifts/diamond.mp4',
        price_in_credit: '5000',
        price_in_diamond: '500',
        created_at: '2025-07-04 09:19:02',
        updated_at: '2025-07-04 09:52:25',
        deleted_at: null,
      },
      {
        id: '5',
        name: 'Special Diamond',
        icon_url: '/default-image.jpg',
        animation_file: '/sample-video.mp4',
        price_in_credit: '200000',
        price_in_diamond: '2000',
        created_at: '2025-07-04 09:19:02',
        updated_at: '2025-07-04 09:52:25',
        deleted_at: null,
      },
    ],
  });
}
