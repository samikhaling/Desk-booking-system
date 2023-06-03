const User = require("../model/user");
const CompanyUser = require("../model/companyUser");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.getUserById = async (req, res, next) => {
  const userId = req.params.id;
  const userMode = req.params.mode;
  console.log(userId, userMode);
  let user;
  if (userMode === "user") {
    user = await User.findOne({ _id: userId });
  } else {
    user = await CompanyUser.findOne({ _id: userId });
  }

  try {
    res.status(200).json({
      message: "Success",
      user: {
        userId: user._id.toString(),
        fname: user.fname || user.ownerFname,
        lname: user.lname || user.ownerLname,
        email: user.email,
      },
    });
  } catch (e) {
    if (!error.statusCode) {
      error.statusCode = 401;
    }
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  const errors = validationResult(req);
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const pass = req.body.password;
  let dupUser;
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed!");
    error.statusCode = 422;
    throw error;
  }
  try {
    dupUser = await User.findOne({ email: email });
    if (dupUser) {
      const error = new Error("Email Address already exists!");
      error.statusCode = 409;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(pass, 12);
    const user = new User({
      fname: fname,
      lname: lname,
      email: email,
      password: hashedPassword,
    });
    const result = await user.save();
    res
      .status(200)
      .json({ message: "user created successfully", userId: result._id });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User does not Exists!");
      error.statusCode = 401;
      throw error;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      const error = new Error("Invalid UserName or Password");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: email,
        userId: user._id.toString(),
      },
      process.env.JWT_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      message: "Login Successfull",
      token: token,
      userId: user._id.toString(),
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postCompanyUser = async (req, res, next) => {
  const errors = validationResult(req);
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const pass = req.body.password;
  let dupUser;
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed!");
    error.statusCode = 422;
    throw error;
  }
  try {
    dupUser = await CompanyUser.findOne({ email: email });
    if (dupUser) {
      const error = new Error("Email Address already exists!");
      error.statusCode = 409;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(pass, 12);
    const companyUser = new CompanyUser({
      ownerFname: fname,
      ownerLname: lname,
      email: email,
      password: hashedPassword,
    });
    const result = await companyUser.save();
    res.status(200).json({
      message: "Company User created successfully",
      userId: result._id,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postCompanyLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password, "companyuser");

  try {
    const user = await CompanyUser.findOne({ email: email });
    if (!user) {
      const error = new Error("User does not Exists!");
      error.statusCode = 401;
      throw error;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      const error = new Error("Invalid UserName or Password");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: email,
        userId: user._id.toString(),
      },
      process.env.JWT_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      message: "Company Login Successfull",
      token: token,
      userId: user._id.toString(),
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
