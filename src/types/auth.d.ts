import { SafeUser } from "./user";

export type AuthResponse = {
    message: string;
  }
  
  export type LoginResponse = {
    token: string;
    user: SafeUser;
  }
  
  export type RegisterPayload = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }
  
  export type LoginPayload = {
    email: string;
    password: string;
  }
  
  export type ForgotPasswordPayload = {
    email: string;
  }
  
  export type ResetPasswordPayload = {
    token: string;
    newPassword: string;
  }
  
  export type UpdateProfilePayload = {
    firstName: string;
    lastName: string;
  }