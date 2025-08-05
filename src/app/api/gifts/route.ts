import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate API response with improved gift data
  return NextResponse.json({
    success: true,
    data: [
      {
        id: '1',
        name: 'Heart',
        icon_url: '❤️',
        animation_file:
          'https://assets3.lottiefiles.com/packages/lf20_V9t630.json',
        lottie_url: 'https://assets3.lottiefiles.com/packages/lf20_V9t630.json',
        price_in_credit: '100',
        price_in_diamond: '10',
        rarity: 'common',
        created_at: '2025-01-08 09:19:02',
        updated_at: '2025-01-08 09:52:25',
        deleted_at: null,
      },
      {
        id: '2',
        name: 'Star',
        icon_url: '⭐',
        animation_file:
          'https://assets3.lottiefiles.com/packages/lf20_s2lryxtd.json',
        lottie_url:
          'https://assets3.lottiefiles.com/packages/lf20_s2lryxtd.json',
        price_in_credit: '500',
        price_in_diamond: '50',
        rarity: 'common',
        created_at: '2025-01-08 09:19:02',
        updated_at: '2025-01-08 09:52:25',
        deleted_at: null,
      },
      {
        id: '3',
        name: 'Crown',
        icon_url: '👑',
        animation_file:
          'https://assets5.lottiefiles.com/packages/lf20_touohxv0.json',
        lottie_url:
          'https://assets5.lottiefiles.com/packages/lf20_touohxv0.json',
        price_in_credit: '1000',
        price_in_diamond: '100',
        rarity: 'rare',
        created_at: '2025-01-08 09:19:02',
        updated_at: '2025-01-08 09:52:25',
        deleted_at: null,
      },
      {
        id: '4',
        name: 'Diamond',
        icon_url: '💎',
        animation_file:
          'https://assets3.lottiefiles.com/private_files/lf30_WdTEui.json',
        lottie_url:
          'https://assets3.lottiefiles.com/private_files/lf30_WdTEui.json',
        price_in_credit: '5000',
        price_in_diamond: '500',
        rarity: 'epic',
        created_at: '2025-01-08 09:19:02',
        updated_at: '2025-01-08 09:52:25',
        deleted_at: null,
      },
      {
        id: '5',
        name: 'Fireworks',
        icon_url: '🎆',
        animation_file:
          'https://assets3.lottiefiles.com/packages/lf20_rovf92ey.json',
        lottie_url:
          'https://assets3.lottiefiles.com/packages/lf20_rovf92ey.json',
        price_in_credit: '200000',
        price_in_diamond: '2000',
        rarity: 'legendary',
        created_at: '2025-01-08 09:19:02',
        updated_at: '2025-01-08 09:52:25',
        deleted_at: null,
      },
    ],
  });
}
