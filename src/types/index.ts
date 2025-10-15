import { Document, Types } from "mongoose";

/**
 * @type User
 */
interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    userId: Types.ObjectId;
}

/**
 * @type Expense
 */
interface IExpense extends Document {
    user: Types.ObjectId | IUser;
    day: number;
    health: number;
    leisure: number;
    grocery: number;
    clothing: number;
    utilities: number;
    electronics: number;
}

/**
 * @type config
 */
interface IConfig {
    port: string | undefined;
    mongo_url: string | undefined;
    cors_origin: string | undefined;
    jwt_secret: string | undefined;
    refresh_token_secret: string | undefined;
    access_token_secret: string | undefined;
    refresh_token_expiry: string | undefined;
    access_token_expiry: string | undefined;
}

/**
 * @type userData
 */
type userData = Pick<IUser, "name" | "email" | "password" | "userId">;
type expenseData = Pick<
    IExpense,
    "health" | "leisure" | "utilities" | "clothing" | "electronics" | "grocery"
>;

export type { IUser, IExpense, userData, expenseData, IConfig };
