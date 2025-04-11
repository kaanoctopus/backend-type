import { User } from "../../types/user";

export interface IUserAdapter {
    findByEmail(email: string): Promise<User | null>;
    updateResetToken(
        id: string,
        resetToken: string,
        expires: Date
    ): Promise<boolean>;
    create(data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }): Promise<User>;
    findById(id: string): Promise<User | null>;
    updateProfile(
        id: string,
        data: {
            firstName?: string;
            lastName?: string;
            password?: string;
            resetPasswordToken?: string | null;
            resetPasswordExpires?: Date | null;
        }
    ): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    findByResetToken(resetToken: string): Promise<User | null>;
}
