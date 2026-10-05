export type UserRole =
  | "platform_admin"
  | "company_admin"
  | "manager"
  | "trainee";

export interface LoginRequest {
  username: string;
  password: string;
  tenant_id?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}