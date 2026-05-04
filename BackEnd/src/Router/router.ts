import { Router } from "express";
import { UserController } from "../Controller/user.controller.js";
import { AutheController } from "../Controller/auth.controller.js";
import { GainController } from "../Controller/gain.controller.js";
import { ExpenseController } from "../Controller/expense.controller.js";

const router = Router();
const userController = new UserController();
const autheController = new AutheController();
const gainController = new GainController();
const expenseController = new ExpenseController();

/* ===============================
    Rotas
=============================== */

router.post("/login", autheController.login);

router.get("/createdUser", userController.createUser);
router.delete(
  "/deleteUser/:id",
  autheController.authentication,
  userController.deleteUser
);

router.post(
  "/createGain",
  autheController.authentication,
  gainController.createGain
);
router.get(
  "/gains",
  autheController.authentication,
  gainController.getAllGains
);
router.get(
  "/gain/:id",
  autheController.authentication,
  gainController.getGainById
);
router.put(
  "/updateGain/:id",
  autheController.authentication,
  gainController.updateGain
);
router.delete(
  "/deleteGain/:id",
  autheController.authentication,
  gainController.deleteGain
);

router.post(
  "/createExpense",
  autheController.authentication,
  expenseController.createExpense
);
router.get(
  "/expenses",
  autheController.authentication,
  expenseController.getAllExpenses
);
router.get(
  "/expense/:id",
  autheController.authentication,
  expenseController.getExpenseById
);
router.put(
  "/updateExpense/:id",
  autheController.authentication,
  expenseController.updateExpense
);
router.delete(
  "/deleteExpense/:id",
  autheController.authentication,
  expenseController.deleteExpense
);

export default router;