import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middlewares/async";
import User from "../models/User";
import ErrorResponse from "../utils/error-response";
import { validateFields, sendTokenResponse } from "../utils/auth-helpers";

// @desc   Register user
// @route  POST /api/v1/auth/signup
// @access Public
export const signup = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { id, name, lastName, email, password, role } = req.body;

    // Check if there's already a user with that email
    const userFound = await User.findOne({ email });

    if (userFound)
      return next(
        new ErrorResponse("That email address is already taken.", 400)
      );

    /* TODO: fetch employee data from Revel.  */
    // When Revel data is available, verify if the email is on the Revel API
    const newUser: any = await User.create({
      id,
      name,
      lastName,
      email,
      password,
      role,
    });

    sendTokenResponse(newUser, 200, res, "sign up");
  }
);

// @desc     Sign in
// @route    POST api/v1/auth/signin
// @access   Public
export const signin = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { email, password } = req.body;

    validateFields(req, next);

    // Check for user by its email
    const user = await User.findOne({ email }).select("+password");

    if (!user) return validateFields(req, next, true);

    const isPasswordRight: boolean = await (user as any).matchPassword(
      password
    );

    if (!isPasswordRight) return validateFields(req, next, true);

    sendTokenResponse(user, 200, res, "sign in");
  }
);

// @desc     Get current logged in user
// @route    GET api/v1/auth/current-user
// @access   Private
export const currentUser = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { id } = (req as any).user;

    const user = await User.findById(id);

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

// @desc     Forgot password
// @route    POST api/v1/auth/forgot-password
// @access   Public
export const forgotPassword = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    // TODO: SendGrip setup

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("There's no user with that email", 404));
    }

    const resetToken = (user as any).getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    console.log(resetToken);

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);
