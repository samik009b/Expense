import mongoose, { Schema, Document, Types } from "mongoose";
import { expenseType } from "../utils/schemaValidator";

export interface ExpenseDocument extends Omit<expenseType, "user">, Document {
  user: Types.ObjectId;
}

const expenseSchema = new Schema<ExpenseDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    day: { type: Number, required: true, min: 1 },
    health: { type: Number, required: true, default: 0 },
    leisure: { type: Number, required: true, default: 0 },
    grocery: { type: Number, required: true, default: 0 },
    clothing: { type: Number, required: true, default: 0 },
    utilities: { type: Number, required: true, default: 0 },
    electronics: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const ExpenseModel = mongoose.model<ExpenseDocument>(
  "Expense",
  expenseSchema
);
