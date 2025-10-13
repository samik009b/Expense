/**
 * @imports
 */
import { Request, Response, NextFunction } from "express";
import { Expense as _expense } from "./expense.model";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import { Expense } from "../expense/expense.model";

/**
 * @param GET
 * @route /expense
 * @route /expense/:day
 * @route /expense?from=startDay?to=lastDay
 */
const getAllExpenses = (req: Request, _res: Response) => {
  const { userId, email } = req.user;
  if (!userId || !email) throw new ApiError(400, "token is invalid or expired");
  throw new ApiResponse(200, email, "gotcha mha faka");
};

const getExpenseOfSingleday = () => {};

const getExpenseOfParticularRange = () => {};

/**
 * @param POST
 * @route /expense
 */
const addExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { health, leisure, grocery, clothing, utilities, electronics } = req.body;
    const userId = req.user.userId;
    const latestExpense = await Expense.findOne({ user: userId }).sort({ day: -1 }).select("day");
    const nextDay = latestExpense ? latestExpense.day + 1 : 1;

    if (!userId) throw new ApiError(401, "User not authenticated");

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

    return res.status(201).json(new ApiResponse(201, dailyExpense, "Expense added successfully"));
  } catch (err) {
    next(err);
  }
};

/**
 * @param PATCH
 * @route /expense/:day
 */
const updateExpenseOfsingleDay = () => {};

/**
 * @param DELETE
 * @route /expense
 * @route /expense/:day
 */
const deleteAllExpense = () => {};

const deleteAllExpenseOfSingleDay = () => {};

/**
 * @exports
 */
export {
  getAllExpenses,
  getExpenseOfSingleday,
  getExpenseOfParticularRange,
  addExpense,
  updateExpenseOfsingleDay,
  deleteAllExpense,
  deleteAllExpenseOfSingleDay
};
