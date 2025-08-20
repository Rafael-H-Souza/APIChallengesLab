import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middeware";
import { UserController } from "../controllers/user.controller";
import { Request, Response, NextFunction } from "express";

export class UserRouter {
  public router: Router;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/register", this.userController.register.bind(this.userController));
    this.router.post("/login", this.userController.login.bind(this.userController));
    this.router.put("/updatePassword",authenticateToken,this.userController.updatePassword.bind(this.userController));
    this.router.get("/user", authenticateToken, this.userController.getUsers.bind(this.userController));
    

    this.router.get("/lista", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {     
        try{
            await this.userController.getUsers(req, res )
          } catch (error) {
            next(error); 
          }
       });
    
  }

  public static getRouter(): Router {
    return new UserRouter().router;
  }
}
