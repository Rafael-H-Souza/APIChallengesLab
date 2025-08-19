import { Router } from "express";
import multer from "multer";
import { UploadController } from "../controllers/upload.controller";

const upload = multer({ dest: "uploads/" });

export class UploadRoutes {
  public router: Router;
  private controller: UploadController;

  constructor() {
    this.router = Router();
    this.controller = new UploadController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/txt", upload.single("file"), this.controller.upload)  
    
  }

  public static getRouter(): Router {
    return new UploadRoutes().router;
  }
}
