const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = expressAsyncHandler(async (req, res) => {
  // regestering process
  const { name, email, password, isTeacher } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    // error occurs if user already exists
    res.status(400);
    throw new Error("User already exists");
  }

  let user;
  if (isTeacher) {
    // condition for teacher
    user = await User.create({
      // user credentials
      name,
      email,
      password,
      isTeacher,
    });
  } else {
    user = await User.create({
      name,
      email,
      password,
    });
  }

  if (user) {
    // creating user
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isTeacher: user.isTeacher,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the user");
  }
});

const authUser = expressAsyncHandler(async (req, res) => {
  // authorization process function
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  // finding email
  if ((user, await user.matchPassword(password))) {
    // evaluating password,email,status
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isTeacher: user.isTeacher,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
    // error occurs for wrong credentials
  }
});

module.exports = { registerUser, authUser };
// exporting moules