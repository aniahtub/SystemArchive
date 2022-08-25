import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { UserValidators } from "./validators/UserValidators";
import { ReportValidators } from "./validators/ReportValidators";

class UserRouter {
  public router: Router;
  constructor() {
    this.router = Router();
    this.getRoutes();
    this.postRoutes();
    this.patchRoutes();
    this.deleteRoutes();
  }

  getRoutes() {
    this.router.get(
      "/user_data",
      GlobalMiddleWare.authenticate,
      UserController.userData
    );
    this.router.get(
      "/user/all",
      GlobalMiddleWare.authenticate,
      UserController.Userall
    );

    this.router.get(
      "/searchbyname",
      GlobalMiddleWare.authenticate,
      GlobalMiddleWare.checkError,
      UserController.searchByName
    );

    this.router.get(
      "/searchbycontent",
      GlobalMiddleWare.authenticate,
      GlobalMiddleWare.checkError,
      UserController.searchByContent
    );
    this.router.get(
      "/searchbytag",
      GlobalMiddleWare.authenticate,
      GlobalMiddleWare.checkError,
      UserController.searchByTag
    );
    this.router.get(
      "/searchbygroup",
      GlobalMiddleWare.authenticate,
      GlobalMiddleWare.checkError,
      UserController.searchByGroup
    );
    this.router.get(
      "/searchbyuploader",
      GlobalMiddleWare.authenticate,
      GlobalMiddleWare.checkError,
      UserController.searchByUploader
    );

    //all reports
    this.router.get(
      "/report/all",
      GlobalMiddleWare.authenticate,
      UserController.allReports
    );

    //all groups
    this.router.get(
      "/group/all",
      GlobalMiddleWare.authenticate,
      UserController.getAllGroups
    );

    //group details
    this.router.get(
      "/group/details/:id",
      GlobalMiddleWare.authenticate,
      UserController.getGroupById
    );
  }
  postRoutes() {
    //admin signup
    this.router.post(
      "/admin/signup",
      UserValidators.signup(),
      GlobalMiddleWare.checkError,
      UserController.adminSignup
    );
    this.router.post(
      "/signup",
      UserValidators.signup(),
      GlobalMiddleWare.checkError,
      UserController.signup
    );

    this.router.post(
      "/login",
      UserValidators.login(),
      GlobalMiddleWare.checkError,
      UserController.login
    );

    //create report
    this.router.post(
      "/report/create",
      GlobalMiddleWare.authenticate,
      ReportValidators.createReport(),
      GlobalMiddleWare.checkError,
      UserController.createReport
    );

    //create group
    this.router.post(
      "/group/create",
      GlobalMiddleWare.authenticate,
      GlobalMiddleWare.checkError,
      UserController.createGroup
    );

    //add group into user
    this.router.post(
        "/group/add",
        GlobalMiddleWare.authenticate,
        GlobalMiddleWare.checkError,
        UserController.addGroup
    );

  }
  patchRoutes() {
    this.router.patch(
      "/update/:id",
      GlobalMiddleWare.authenticate,
      UserValidators.update(),
      GlobalMiddleWare.checkError,
      UserController.update
    );
    this.router.patch(
      "/update/admin/:id",
      GlobalMiddleWare.adminAuthenticate,
      UserValidators.update(),
      GlobalMiddleWare.checkError,
      UserController.update
    );

    //update report
    this.router.patch(
      "/report/update/:id",
      GlobalMiddleWare.authenticate,
      ReportValidators.updateReport(),
      GlobalMiddleWare.checkError,
      UserController.updateReport
    );

    //update group
    this.router.patch(
      "/group/update/:id",
      GlobalMiddleWare.authenticate,
      GlobalMiddleWare.checkError,
      UserController.updateGroup
    );
  }

  deleteRoutes() {
    this.router.delete(
      "/delete/:id",
      GlobalMiddleWare.authenticate,
      UserValidators.deleteUser(),
      GlobalMiddleWare.checkError,
      UserController.deleteUser
    );
    this.router.delete(
      "/delete/admin/:id",
      GlobalMiddleWare.adminAuthenticate,
      UserValidators.deleteUser(),
      GlobalMiddleWare.checkError,
      UserController.deleteUser
    );
    //delete report
    this.router.delete(
      "/report/delete/:id",
      GlobalMiddleWare.authenticate,
      ReportValidators.deleteReport(),
      GlobalMiddleWare.checkError,
      UserController.deleteReport
    );

    //delete group
    this.router.delete(
      "/group/delete/:id",
      GlobalMiddleWare.authenticate,
      GlobalMiddleWare.checkError,
      UserController.deleteGroup
    );
  }
}

export default new UserRouter().router;
