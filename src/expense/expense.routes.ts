import { Router } from "express";
import {
    addExpense,
    deleteAllExpense,
    deleteExpenseOfSingleDay,
    getAllExpenses,
    getExpenseOfParticularRange,
    getExpenseOfSingleday
} from "./expense.controller";
import validateToken from "../utils/validateToken";

const router = Router();

/**
 * GET all expenses
 * @param /expense/
 */
router.get("/", validateToken, getAllExpenses);

/**
 * GET expense of a single day
 * @param /expense/day/:day
 */
router.get("/day/:day", validateToken, getExpenseOfSingleday);

/**
 * GET expenses in a particular range
 * @param /expense/range?startDay=start&lastDay=end
 */
router.get("/range", validateToken, getExpenseOfParticularRange);

/**
 * POST add a new expense
 * @param /expense/
 */
router.post("/", validateToken, addExpense);

/**
 * DELETE all expenses
 * @param /expense
 */
router.delete("/", validateToken, deleteAllExpense);

/**
 * DELETE all expenses
 * @param /expense
 */
router.delete("/day/:day", validateToken, deleteExpenseOfSingleDay);

export const expenseRouter = router;
