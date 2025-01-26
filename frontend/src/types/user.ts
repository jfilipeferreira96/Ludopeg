
export enum UserType {
  STUDENT = "Student",
  TEACHER = "Teacher",
  ADMIN = "Admin",
}

export interface User {
  id: string;
  email: string;
  user_type: UserType | string;
  first_name: string;
  last_name: string;
  phone?: string;
  birthdate: string | Date;
  locations?: { location_id: number; location_name: string }[];
  offpeaks?: { offpeak_card_id: number; name: string; valid_until: Date; month: number; year: number }[];
  video_credits?: number;
}
