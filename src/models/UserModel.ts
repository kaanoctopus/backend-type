import { PrismaUserAdapter } from "../adapters/PrismaUserAdapter";
import { IUserAdapter } from "../adapters/interfaces/IUserAdapter";

export const UserModel: IUserAdapter = new PrismaUserAdapter();
