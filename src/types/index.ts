import { Document, Types } from "mongoose";

/**
 * @type User
 */
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
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
export type { IUser, IExpense };
