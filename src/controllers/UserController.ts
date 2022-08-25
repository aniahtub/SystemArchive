import * as Jwt from "jsonwebtoken";
import { getEnvironmentVariables } from "../environments/env";
import User from "../models/User";
import axios from "axios";
import * as Bcrypt from "bcrypt";
import Report from "../models/Report";
import Group from "../models/Group";
import { body } from 'express-validator';

export class UserController {
  static async signup(req, res, next) {
    try {
      console.log("req.body", req.body);

      const salt = await Bcrypt.genSalt(10);
      const hashedPassword = await Bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
      const user = await User.create(req.body);
      res.json({
        message: "Success ! User Created Successfully",
        user: user,
        status_code: 200,
      });
    } catch (e) {
      next(e);
    }
  }

  static async adminSignup(req, res, next) {
    try {
      //role is admin
      req.body.role = "admin";
      //password hash
      const salt = await Bcrypt.genSalt(10);
      const hashedPassword = await Bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
      const user = await User.create(req.body);

      res.json({
        message: "Success ! Admin Created Successfully",
        user: user,
        status_code: 200,
      });
    } catch (e) {
      next(e);
    }
  }

  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const user = req.user;
      const isMatch = await Bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Password is incorrect",
          status_code: 401,
        });
      }
      const token = Jwt.sign(
        { _id: user._id, role: user.role },
        getEnvironmentVariables().jwt_secret
      );
      res.json({
        message: "Success ! User Logged In Successfully",
        token: token,
        user: user,
        status_code: 200,
      });
    } catch (e) {
      next(e);
    }
  }

  static async userData(req, res, next) {
    const userId = req.user._id;
    try {
      const user = await User.findById(userId);
      res.json({
        message: "Success ! User Data",
        user: user,
        status_code: 200,
      });
    } catch (e) {
      next(e);
    }
  }

  static async Userall(req, res, next) {
    try {
      if (req.user.role === "admin") {
        const users = await User.find();
        res.json({
          message: "Success ! All Users",
          users: users,
          status_code: 200,
        });
      } else {
        return res.status(401).json({
          message: "You are not authorized to view this page",
          status_code: 401,
        });
      }
    } catch (e) {
      next(e);
    }
  }

  static async update(req, res, next) {
    const userId = req.user._id;

    try {
      //findbyidanupdate
      const user = await User.findByIdAndUpdate(userId, req.body);
      res.json({
        message: "Success ! User Updated Successfully",
        user: user,
        status_code: 200,
      });
    } catch (e) {
      next(e);
    }
  }

  static async deleteUser(req, res, next) {
    const userId = req.user._id;
    try {
      const user = await User.findByIdAndDelete(userId);
      res.json({
        message: "Success ! User Deleted Successfully",
        user: user,
        status_code: 200,
      });
    } catch (e) {
      next(e);
    }
  }

  // createReport
  static async createReport(req, res, next) {
    const userId = req.user._id;
    try {
      const report = await Report.create({
        uploader: userId,
        ...req.body,
      });
      res.json({
        message: "Success ! Report Created Successfully",
        report: report,
        status_code: 200,
      });
    } catch (e) {
      next(e);
    }
  }

  //updateReport
  static async updateReport(req, res, next) {
    const userId = req.user._id;
    try {
      const report = await Report.findByIdAndUpdate(req.params.id, req.body);
      res.json({
        message: "Success ! Report Updated Successfully",
        report: report,
        status_code: 200,
      });
    } catch (e) {
      next(e);
    }
  }
  //deleteReport
  static async deleteReport(req, res, next) {
    const userId = req.user._id;
    try {
      const report = await Report.findByIdAndDelete(req.params.id);
      res.json({
        message: "Success ! Report Deleted Successfully",
        report: report,
        status_code: 200,
      });
    } catch (e) {
      next(e);
    }
  }

  //getAllReports
  static async allReports(req, res, next) {
    try {
      //if user is admin then get all reports else get only reports of user
      let user = req.user;
      let userId = user._id;
      if (user.role === "admin") {
        const reports = await Report.find();
        res.json({
          message: "Success ! All Reports",
          reports: reports,
          status_code: 200,
        });
      } else {
        const reports = await Report.find({ uploader: userId });
        res.json({
          message: "Success ! All Reports",
          reports: reports,
          status_code: 200,
        });
      }
    } catch (e) {
      next(e);
    }
  }

  //getbyid
  static async getById(req, res, next) {
    try {
      //if user is admin then get all reports else get only reports of user
      let user = req.user;
      let userId = user._id;
      if (user.role === "admin") {
        const report = await Report.findById(req.params.id);
        res.json({
          message: "Success ! Report",
          report: report,
          status_code: 200,
        });
      } else {
        //check if user and report in same group
        const report = await Report.findById(req.params.id);
        if (report.group === user.group) {
          res.json({
            message: "Success ! Report",
            report: report,
            status_code: 200,
          });
        } else {
          res.status(401).json({
            message:
              "Unauthorized ! You are not authorized to view this report",
            status_code: 401,
          });
        }
      }
    } catch (e) {
      next(e);
    }
  }

  // searchByName
  static async searchByName(req, res, next) {
    try {
      //if user is admin then get all reports else get only reports of user
      let user = req.user;
      let userId = user._id;
      if (user.role === "admin") {
        const reports = await Report.find({
          name: { $regex: req.query.name, $options: "i" },
        });
        res.json({
          message: "Success ! All Reports",
          reports: reports,
          status_code: 200,
        });
      } else {
        //check if user and report in same group
        const reports = await Report.find({
          name: { $regex: req.query.name, $options: "i" },
          
        });
        res.json({
          message: "Success ! All Reports",
          reports: reports,
          status_code: 200,
        });
      }
    } catch (e) {
      next(e);
    }
  }

  // By content.
  static async searchByContent(req, res, next) {
    try {
      //if user is admin then get all reports else get only reports of user
      let user = req.user;
      let userId = user._id;
      if (user.role === "admin") {
        const reports = await Report.find({
          content: { $regex: req.query.content, $options: "i" },
        });
        res.json({
          message: "Success ! All Reports",
          reports: reports,
          status_code: 200,
        });
      } else {
        //check if user and report in same group
        const reports = await Report.find({
          content: { $regex: req.query.content, $options: "i" },
          group: user.group,
        });
        res.json({
          message: "Success ! All Reports",
          reports: reports,
          status_code: 200,
        });
      }
    } catch (e) {
      next(e);
    }
  }

  // By tag
  static async searchByTag(req, res, next) {
    try {
      //if user is admin then get all reports else get only reports of user
      let user = req.user;
      let userId = user._id;
      if (user.role === "admin") {
        const reports = await Report.find({
          tags: { $regex: req.query.tag, $options: "i" },
        });
        res.json({
          message: "Success ! All Reports",
          reports: reports,
          status_code: 200,
        });
      } else {
        //check if user and report in same group
        const reports = await Report.find({
          tags: { $regex: req.query.tag, $options: "i" },
          group: user.group,
        });
        res.json({
          message: "Success ! All Reports",
          reports: reports,
          status_code: 200,
        });
      }
    } catch (e) {
      next(e);
    }
  }

  // By group.
  static async searchByGroup(req, res, next) {
    try {
      //if user is admin then get all reports else get only reports of user
      let user = req.user;
      let userId = user._id;
      if (user.role === "admin") {
        const reports = await Report.find({
          group: { $regex: req.query.group, $options: "i" },
        });
        res.json({
          message: "Success ! All Reports",
          reports: reports,
          status_code: 200,
        });
      } else {
        //check if user and report in same group
        const reports = await Report.find({
          group: { $regex: req.query.group, $options: "i" },
        });
        res.json({
          message: "Success ! All Reports",
          reports: reports,
          status_code: 200,
        });
      }
    } catch (e) {
      next(e);
    }
  }

  // By uploader
  static async searchByUploader(req, res, next) {
    try {
      //if user is admin then get all reports else get only reports of user
      let user = req.user;
      let userId = user._id;
      if (user.role === "admin") {
        const reports = await Report.find({
          uploader: { $regex: req.query.uploader, $options: "i" },
        });
        res.json({
          message: "Success ! All Reports",
          reports: reports,
          status_code: 200,
        });
      } else {
        //check if user and report in same group
        const reports = await Report.find({
          uploader: { $regex: req.query.uploader, $options: "i" },
          group: user.group,
        });
        res.json({
          message: "Success ! All Reports",
          reports: reports,
          status_code: 200,
        });
      }
    } catch (e) {
      next(e);
    }
  }

  // createGroup
  static async createGroup(req, res, next) {
    try {
      //if user is admin then he can create group else he can't
      let user = req.user;
      let userId = user._id;
      if (user.role === "admin") {
        const group = await Group.create(req.body);
        res.json({
          message: "Success ! Group Created",
          group: group,
          status_code: 200,
        });
      } else {
        res.status(401).json({
          message: "Unauthorized ! You are not authorized to create group",
          status_code: 401,
        });
      }
    } catch (e) {
      next(e);
    }
  }

  //updateGroup
  static async updateGroup(req, res, next) {
    try {
      //if user is admin then he can update group else he can't
      let user = req.user;
      let userId = user._id;
      if (user.role === "admin") {
        const group = await Group.findByIdAndUpdate(req.params.id, req.body);
        res.json({
          message: "Success ! Group Updated",
          group: group,
          status_code: 200,
        });
      } else {
        res.status(401).json({
          message: "Unauthorized ! You are not authorized to update group",
          status_code: 401,
        });
      }
    } catch (e) {
      next(e);
    }
  }

  //deleteGroup
  static async deleteGroup(req, res, next) {
    try {
      //if user is admin then he can delete group else he can't
      let user = req.user;
      let userId = user._id;
      if (user.role === "admin") {
        const group = await Group.findByIdAndDelete(req.params.id);
        res.json({
          message: "Success ! Group Deleted",
          group: group,
          status_code: 200,
        });
      } else {
        res.status(401).json({
          message: "Unauthorized ! You are not authorized to delete group",
          status_code: 401,
        });
      }
    } catch (e) {
      next(e);
    }
  }

  //getAllGroups
  static async getAllGroups(req, res, next) {
    try {
      //if user is admin then he can get all groups else he can't
      let user = req.user;
      let userId = user._id;
      if (user.role === "admin") {
        const groups = await Group.find();
        res.json({
          message: "Success ! All Groups",
          groups: groups,
          status_code: 200,
        });
      } else {
        res.status(401).json({
          message: "Unauthorized ! You are not authorized to get all groups",
          status_code: 401,
        });
      }
    } catch (e) {
      next(e);
    }
  }

  //getGroupById
  static async getGroupById(req, res, next) {
    try {
      //if user is admin then he can get group else he can't
      let user = req.user;
      let userId = user._id;
      if (user.role === "admin") {
        const group = await Group.findById(req.params.id);
        res.json({
          message: "Success ! Group Found",
          group: group,
          status_code: 200,
        });
      } else {
        res.status(401).json({
          message: "Unauthorized ! You are not authorized to get group",
          status_code: 401,
        });
      }
    } catch (e) {
      next(e);
    }
  }

  // addGroup
  static async addGroup(req, res, next) {
    try {
      //if user is admin then he can add group else he can't
      let user = req.user;
      let userId = user._id;
      if (user.role === "admin") {
        const User1 = await User.findByIdAndUpdate(
          req.body.userId,
          { $push: { group: req.body.groupId } },
          { new: true }
        );
        res.json({
          message: "Success ! Group Added",
          user: User1,
          status_code: 200,
        });
      } else {
        res.status(401).json({
          message: "Unauthorized ! You are not authorized to add group",
          status_code: 401,
        });
      }
    } catch (e) {
      next(e);
    }
  }
}
