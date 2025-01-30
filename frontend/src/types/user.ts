
export enum UserType {
  JOGADOR = "Jogador",
  ADMIN = "Admin",
}

export interface User {
  is_subscribed_to_newsletter: boolean;
  created_at?: string | number | Date;
  user_id: string | number;
  email: string;
  user_type: UserType | any;
  fullname: string;
  username: string;
  phone?: string;
  birthdate: string | Date | undefined;
  locations?: { location_id: number; location_name: string }[];
  offpeaks?: { offpeak_card_id: number; name: string; valid_until: Date; month: number; year: number }[];
  video_credits?: number;
  password?: string;
}
