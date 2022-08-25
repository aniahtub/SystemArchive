import { body, param, query } from "express-validator";
import Reoprt from "../../models/Report";

export class ReportValidators {
  static createReport() {
    return [
        body("name", "Title is Required").isString(),
        body("description", "Description is Required").isString(),
        body("related_files", "Related Files is Required"),
        body("tags", "Tags is Required"),
        body("group", "Group is Required").isString(),
        body("content", "Content is Required").isString()

    ];
  }

  static deleteReport() {
    return [
      param("id").custom((id, { req }) => {
        return Reoprt.findById(id).then((report) => {
          if (report) {
            if (report.uploader == req.user._id || req.user.role == "admin") {
              req.report = report;
              return true;
            } else {
              throw new Error("You are not authorized to delete this report");
            }
          } else {
            throw new Error("Report Does Not Exist");
          }
        });
      }),
    ];
  }

  static updateReport() {
    return [
      param("id").custom((id, { req }) => {
        return Reoprt.findById(id).then((report) => {
          if (report) {
            if (report.uploader == req.user._id || req.user.role == "admin") {
              req.report = report;
              return true;
            } else {
              throw new Error("You are not authorized to update this report");
            }
          } else {
            throw new Error("Report Does Not Exist");
          }
        });
      }),
    ];
  }


}
