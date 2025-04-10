export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: Date | null;
  }
  
  export type SafeUser = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }