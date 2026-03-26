export interface CheckSessionRequest {
  success: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface  UpdateUserRequest {
  username?: string;
  avatarFile?: File;
}
