import { Router } from "express";
import { addExpense, getAllExpenses } from "./expense.controller";
import validateToken from "../utils/validateToken";

const router = Router();
/**
 * routes
 */
router.get("/", validateToken, getAllExpenses);
router.post("/", validateToken, addExpense);

export const expenseRouter = router;
