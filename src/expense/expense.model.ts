import mongoose, { Schema } from "mongoose";
import { IExpense } from "../types";

const expenseSchema = new Schema<IExpense>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        day: {
            type: Number,
            required: true,
            min: 1
        },
        health: {
            type: Number,
            required: true,
            default: 0
        },
        leisure: {
            type: Number,
            required: true,
            default: 0
        },
        grocery: {
            type: Number,
            required: true,
            default: 0
        },
        clothing: {
            type: Number,
            required: true,
            default: 0
        },
        utilities: {
            type: Number,
            required: true,
            default: 0
        },
        electronics: {
            type: Number,
            required: true,
            default: 0
        }
    },
    { timestamps: true }
);

export const Expense = mongoose.model<IExpense>("Expense", expenseSchema);
