import { body, param, query } from "express-validator";
import User from "../../models/User";

export class UserValidators {
  static signup() {
    return [
      body("name", "name is Required").isString(),
      body("password", "password is Required").isString(),
      body("email", "email Is Required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({ email: email }).then((user) => {
            if (user) {
              throw new Error("User Already Exist");
            } else {
              return true;
            }
          });
        }),
      body("phone", "Phone with numeric value Is Required")
        .isNumeric()
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone must be 10 digit")
        .custom((phone, { req }) => {
          return User.findOne({ phone: phone }).then((user) => {
            if (user) {
              throw new Error("User Already Exist");
            } else {
              return true;
            }
          });
        }),
    ];
  }

  static login() {
    return [
      body("email", "Email is Required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({ email: email}).then((user) => {
            if (user) {
              req.user = user;
              return true;
            } else {
              throw new Error("User Does Not Exist");
            }
          });
        }),
        body("password", "Password is Required").isString(),
    ];
  }

  static deleteUser() {
    return [
      param("id").custom((id, { req }) => {
        return User.findById(id).then((user) => {
          if (user) {
            req.user = user;
            return true;
          } else {
            throw new Error("user Does Not Exist");
          }
        });
      }),
    ];
  }

  static update() {
    return [
      param("id").custom((id, { req }) => {
        return User.findById(id).then((user) => {
          if (user) {
            req.user = user;
            return true;
          } else {
            throw new Error("user Does Not Exist");
          }
        });
      }),
    ];
  }
}
