export interface Gift {
  id: string;
  name: string;
  icon_url: string;
  animation_file: string;
  price_in_credit: string;
  price_in_diamond: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface GiftApiResponse {
  success: boolean;
  data: Gift[];
  message?: string;
}