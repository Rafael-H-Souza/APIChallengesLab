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

      this.router.post("/register", async (req: Request, res: Response, next: NextFunction): Promise<void> => {     
        try{
            await this.userController.register.bind(this.userController)
          } catch (error) {
            next(error); 
          }
       });    
    
   
    this.router.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {     
      try{
          await this.userController.login.bind(this.userController)
        } catch (error) {
          next(error); 
        }
      });    
  
    

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
