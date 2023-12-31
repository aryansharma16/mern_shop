import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

// for registration of user  post request
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    //validations
    // required
    if (!name) return res.send({ message: "name is required" });
    if (!email) return res.send({ message: "email is required" });
    if (!password) return res.send({ message: "password is required" });
    if (!phone) return res.send({ message: "phone is required" });
    if (!address) return res.send({ message: "address is required" });

    // check Existing User
    // ...

    // check Existing User
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered. Please login.'in back-end'",
      });
    }

    // register user
    const hashedPassword = await hashPassword(password);
    // save user
    const user = new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword, // corrected variable name
    }).save();

    res.status(200).send({
      success: true,
      message: "User registered successfully 'in back-end'",
      user,
    });
    console.log(res, "heloo as");
    // ...
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in Resgistration 'in back-end'",
      err,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "invaled email or password 'in back-end'",
      });
    }
    // checck user
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered 'in back-end'",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password! 'in back-end'",
      });
    }

    // create Token
    const token = await JWT.sign(
      { _id: user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    res.status(200).send({
      success: true,
      message: "LoginSuccessfully 'in back-end'",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login 'in back-end'",
      error,
    });
  }
};

export const testController = async (req, res, next) => {
  console.log("protected route");
  res.send("Protected test route");
  // next()
};
