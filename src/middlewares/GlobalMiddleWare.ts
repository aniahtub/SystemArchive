import { validationResult } from "express-validator";
import * as Jwt from "jsonwebtoken";
import { getEnvironmentVariables } from "../environments/env";
// import Admin from "../models/Admin";
import User from "../models/User";

export class GlobalMiddleWare {
  static checkError(req, res, next) {
    const error = validationResult(req);
    const errorStatus = req.errorStatus || 400;

    if (!error.isEmpty()) {
      return res.status(errorStatus).json({
        error: error.array(),
      });
    } else {
      next();
    }
  }

  // only for login
  static async authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.slice(7, authHeader.length) : null;

    try {
      Jwt.verify(
        token,
        getEnvironmentVariables().jwt_secret,
        async (err, decoded) => {
          if (err) {
            req.errorStatus = 401;
            next(err);
          } else if (!decoded) {
            req.errorStatus = 401;
            next(new Error("User Not Authorised"));
          } else {
            req.user = decoded;
            next();
          }
        }
      );
    } catch (e) {
      req.errorStatus = 401;
      next(e);
    }
  }

  // for admin
  static async adminAuthenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
    try {
      Jwt.verify(
        token,
        getEnvironmentVariables().jwt_secret,
        async (err, decoded) => {
          if (err) {
            req.errorStatus = 401;
            next(err);
          } else if (!decoded) {
            req.errorStatus = 401;
            next(new Error("User Not Authorised"));
          } else if (decoded.role !== "admin") {
            req.errorStatus = 401;
            next(new Error("User Not Authorised"));
          } else {
            req.user = decoded;
            next();
          }
        }
      );
    } catch (e) {
      req.errorStatus = 401;
      next(e);
    }
  }
}
