export interface Gift {
  id: string;
  name: string;
  icon_url: string;
  animation_file: string; // Lottie JSON URL
  lottie_url?: string; // Optional separate Lottie URL
  price_in_credit: string;
  price_in_diamond: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface GiftApiResponse {
  success: boolean;
  data: Gift[];
  message?: string;
}
