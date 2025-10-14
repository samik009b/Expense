/**
 * @imports
 */
import { Request, Response, NextFunction } from "express";
import { Expense } from "./expense.model";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";

/**
 * @param GET
 * @route /expense
 */
const getAllExpenses = async (req: Request, res: Response) => {
    const { userId, email } = req.user;
    if (!userId || !email) throw new ApiError(400, "token is invalid or expired");

    const allExpenses = await Expense.find().lean().exec();
    return res
        .status(201)
        .send(new ApiResponse(200, allExpenses, `brought all expenses of ${email}`));
};

/**
 * @param GET
 * @route /expense/:day
 */
const getExpenseOfSingleday = async (req: Request, res: Response) => {
    const { userId, email } = req.user;
    const { day } = req.params;
    if (!userId) throw new ApiError(400, "token is invalid or expired");

    const ExpenseOfTheDay = await Expense.findOne({
        $and: [{ user: userId }, { day }]
    });
    return res
        .status(200)
        .send(new ApiResponse(201, ExpenseOfTheDay, `day ${day} expense of user ${email}`));
};

/**
 * @param GET
 * @route /expense?from=startDay&to=lastDay
 */
const getExpenseOfParticularRange = async (req: Request, res: Response) => {
    const startDay = parseInt(req.query.startDay as string);
    const lastDay = parseInt(req.query.lastDay as string);
    const { userId } = req.user;

    if (isNaN(startDay) || isNaN(lastDay)) {
        throw new ApiError(400, "Both startDay and lastDay should be valid numbers");
    }
    if (startDay < 1) throw new ApiError(400, "Starting day cannot be less than 1");
    if (lastDay < startDay) throw new ApiError(400, "lastDay cannot be before startDay");

    const latestExpense = await Expense.findOne({ user: userId })
        .sort({ day: -1 })
        .select("day")
        .lean()
        .exec();

    if (!latestExpense) throw new ApiError(404, "No expenses found for this user.");
    if (lastDay > latestExpense.day) {
        throw new ApiError(400, `The latest entry in database is day ${latestExpense.day}`);
    }

    // Fetch expenses in the range
    const expenses = await Expense.find({
        user: userId,
        day: { $gte: startDay, $lte: lastDay }
    }).lean();

    res.status(200).json({
        success: true,
        message: `Expenses from day ${startDay} to ${lastDay}`,
        data: expenses
    });
};

/**
 * @param POST
 * @route /expense
 */
const addExpense = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { health, leisure, grocery, clothing, utilities, electronics } = req.body;
        const userId = req.user.userId;
        const latestExpense = await Expense.findOne({ user: userId })
            .sort({ day: -1 })
            .select("day");
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

        return res
            .status(201)
            .json(new ApiResponse(201, dailyExpense, "Expense added successfully"));
    } catch (err) {
        next(err);
    }
};

/**
 * @param PATCH
 * @route /expense/:day
 */
// const updateExpenseOfsingleDay = async (req: Request, res: Response) => {};

/**
 * @param DELETE
 * @route /expense
 */
const deleteAllExpense = async (req: Request, res: Response) => {
    const userId = req.user.userId;

    await Expense.deleteMany({ user: userId });

    return res.status(200).json(new ApiResponse(200, "all expenses deleted of the user"));
};
/**
 * @param DELETE
 * @route /expense/:day
 */
const deleteExpenseOfSingleDay = async (req: Request, res: Response) => {
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
    deleteExpenseOfSingleDay
};

/**
 * @todo wrap everything inside try catch
 * @todo type checks for req body inputs using pick function
 */
