import ErrorResponse from "./error-response";
import { NextFunction, Request, Response } from "express";

export const validateFields = (
  req: Request,
  next: NextFunction,
  unuthorized: boolean = false
) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(
      new ErrorResponse("The email and password fields are mandatory.", 400)
    );

  if (unuthorized)
    return next(
      new ErrorResponse(
        "Invalid credentials. Please check them and try again.",
        401
      )
    );
};

// Get token from model, create cookie and send response
export const sendTokenResponse = (
  user: any,
  statusCode: number,
  res: Response,
  operation: string
) => {
  // Create token
  const token: string = user.getSignedJwtToken();

  const options: any = { httpOnly: true };

  if (process.env.NODE_ENV === "production") options.secure = true;

  res
    .status(statusCode)
    .cookie("token", token)
    .json({
      success: true,
      message: `${
        operation === "sign up" ? "Signed up" : "Signed in"
      } successfully!`,
      token,
    });
};
