import {
    signup,
    signin,
    currentUser,
    changePassword,
    forgotPassword
  } from "./../controllers/auth.controller";
  import { Router } from "express";
  
  const authRouter: Router = Router(); 

  authRouter
  .route("/signup") 
  .post(signup);

  authRouter
  .route("/signin") 
  .post(signin);

  authRouter
  .route("/current-user") 
  .post(currentUser);

  authRouter
  .route("/forgot-password") 
  .post(changePassword)
  .post(forgotPassword);
 

  export default cajeroRouter;
  