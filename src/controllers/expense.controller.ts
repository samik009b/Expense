/**
 * @imports
 */
import { Request, Response, NextFunction } from "express";
import { Expense } from "../models/expense.model";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import { userData, expenseData } from "../types";
import mongoose from "mongoose";

/**
 * @method GET
 * @route /expense
 */

const getAllExpenses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, email } = req.user as userData;
        if (!userId || !email) throw new ApiError(400, "token is invalid or expired");

        const allExpenses = await Expense.find({ user: new mongoose.Types.ObjectId(userId) })
            .lean()
            .exec();

        return res
            .status(200)
            .send(new ApiResponse(200, allExpenses, `brought all expenses of ${email}`));
    } catch (error) {
        next(error);
    }
};

/**
 * @method GET
 * @route /expense/day/:day
 */
const getExpenseOfSingleday = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, email } = req.user as userData;
        const { day } = req.params;
        if (!userId) throw new ApiError(400, "token is invalid or expired");

        const ExpenseOfTheDay = await Expense.findOne({
            $and: [{ user: userId }, { day }]
        });
        return res
            .status(200)
            .send(new ApiResponse(201, ExpenseOfTheDay, `day ${day} expense of user ${email}`));
    } catch (error) {
        next(error);
    }
};

/**
 * @method GET
 * @route /expense?startDay=startDay&lastDay=lastDay
 */
const getExpenseOfParticularRange = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const startDay = parseInt(req.query.startDay as string);
        const lastDay = parseInt(req.query.lastDay as string);
        const { userId } = req.user as userData;

        if (isNaN(startDay) || isNaN(lastDay)) {
            throw new ApiError(400, "both startDay and lastDay should be valid numbers");
        }
        if (startDay < 1) throw new ApiError(400, "starting day cannot be less than 1");
        if (lastDay < startDay) throw new ApiError(400, "lastDay cannot be before startDay");

        const latestExpense = await Expense.findOne({ user: userId })
            .sort({ day: -1 })
            .select("day")
            .lean()
            .exec();

        if (!latestExpense) throw new ApiError(404, "no expenses found for this user.");
        if (lastDay > latestExpense.day) {
            throw new ApiError(400, `the latest entry in database is day ${latestExpense.day}`);
        }

        const expenses = await Expense.find({
            user: userId,
            day: { $gte: startDay, $lte: lastDay }
        })
            .lean()
            .exec();

        res.status(200).json({
            success: true,
            message: `expenses from day ${startDay} to ${lastDay}`,
            data: expenses
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @method POST
 * @route /expense
 */
const addExpense = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { health, leisure, grocery, clothing, utilities, electronics } =
            req.body as expenseData;
        const userId = req.user.userId as userData;
        const latestExpense = await Expense.findOne({ user: userId })
            .sort({ day: -1 })
            .select("day");
        const nextDay = latestExpense ? latestExpense.day + 1 : 1;

        if (!userId) throw new ApiError(401, "user not authenticated");

        const dailyExpense = await Expense.create({
            user: userId,
            day: nextDay,
            health,
            leisure,
            grocery,
            clothing,
            utilities,
            electronics
        });

        return res
            .status(201)
            .json(new ApiResponse(201, dailyExpense, "expense added successfully"));
    } catch (err) {
        next(err);
    }
};

/**
 * @method PATCH
 * @route /expense/day/:day
 */
const updateExpenseOfsingleDay = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.userId as string;
        const { health, leisure, grocery, clothing, utilities, electronics } = req.body;

        const updatedObject: Record<string, number> = {};
        if (health) updatedObject.health = health;
        if (leisure) updatedObject.leisure = leisure;
        if (grocery) updatedObject.grocery = grocery;
        if (clothing) updatedObject.clothing = clothing;
        if (utilities) updatedObject.utilities = utilities;
        if (electronics) updatedObject.electronics = electronics;

        if (Object.keys(updatedObject).length === 0)
            throw new ApiError(400, "no valid fields provided");

        const updatedExpense = await Expense.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(userId) }, // ✅ filter by user
            { $inc: updatedObject },
            { new: true, upsert: true }
        );

        return res
            .status(200)
            .json(new ApiResponse(200, updatedExpense, "expense updated successfully"));
    } catch (error) {
        next(error);
    }
};

/**
 * @method DELETE
 * @route /expense
 */
const deleteAllExpense = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.userId;

        await Expense.deleteMany({ user: userId });

        return res.status(200).json(new ApiResponse(200, "all expenses deleted of the user"));
    } catch (error) {
        next(error);
    }
};
/**
 * @method DELETE
 * @route /expense/day/:day
 */
const deleteExpenseOfSingleDay = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.userId;
        const day = parseInt(req.params.day);

        const ExistedEntry = await Expense.exists({
            $and: [{ user: userId }, { day }]
        });

        await Expense.deleteOne({
            $and: [{ user: userId }, { day }]
        });

        return res
            .status(200)
            .json(new ApiResponse(200, ExistedEntry, `deleted the entry of day: ${day}`));
    } catch (error) {
        next(error);
    }
};

/**
 * @exports
 */
export {
    getAllExpenses,
    getExpenseOfSingleday,
    getExpenseOfParticularRange,
    addExpense,
    deleteAllExpense,
    deleteExpenseOfSingleDay,
    updateExpenseOfsingleDay
};
