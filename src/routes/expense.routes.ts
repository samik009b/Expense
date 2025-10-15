import { Router } from "express";
import {
    addExpense,
    deleteAllExpense,
    deleteExpenseOfSingleDay,
    getAllExpenses,
    getExpenseOfParticularRange,
    getExpenseOfSingleday,
    updateExpenseOfsingleDay
} from "../controllers/expense.controller";
import validateToken from "../utils/validateToken";

const router = Router();

router.use(validateToken);
/**
 * @method GET
 */
router.get("/", getAllExpenses);
router.get("/day/:day", getExpenseOfSingleday);
router.get("/range", getExpenseOfParticularRange);

/**
 * @method POST
 */
router.post("/", addExpense);

/**
 * @method DELETE
 */
router.delete("/", deleteAllExpense);
router.delete("/day/:day", deleteExpenseOfSingleDay);

/**
 * @method PATCH
 */
router.patch("/day/:day", updateExpenseOfsingleDay);

export const expenseRouter = router;
