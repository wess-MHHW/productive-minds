const promiseHandler = require("./../utils/functions/promise-handler");
const generateToken = require("./../utils/functions/generate-token");
const verifyToken = require("./../utils/functions/verify-token");
const sendEmail = require("./../utils/functions/send-email");
const getUser = require("./../utils/functions/get-user");

const User = require("./../models/user");
const CustomError = require("./../utils/classes/custom-error");
const crypto = require("crypto");

exports.signp = promiseHandler(async (req, res, next) => {
  const { name, email, occupation, password } = req.body;

  if (await User.findOne({ email })) {
    next(new CustomError(400, "Email is already taken."));
    return;
  }

  let user = new User({
    name,
    email,
    occupation,
    password,
  });

  user = await user.save(user);

  let result = await getUser(user);

  const token = generateToken(user._id);

  res.status(201).json({
    status: "success",
    token,
    data: result,
  });
});

exports.login = promiseHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new CustomError(400, "Credantilas missing."));
    return;
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    next(new CustomError(400, "Invalid Credantilas."));
    return;
  }

  let data = await getUser(user);

  const token = generateToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    data: data,
  });
});

exports.forgotPassword = promiseHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    next(new CustomError(400, "User doesn't exist."));
    return;
  }

  const token = user.createToken();
  await user.save({ validateBeforeSave: false });

  const message = `We have received a request to reset your password. Please use the code below to reset your password.\n\n${token}\n\nThis password token will only be valid for 5 minutes.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password change request recieved",
      text: message,
    });

    res.status(200).json({
      status: "success",
      message: `Password reset link sent to ${email}`,
    });
  } catch (error) {
    user.token = null;
    user.save({ validateBeforeSave: false });
    return res.status(400).json({
      status: "failure",
      message: `Sending email error: ${error.name}`,
    });
  }
});

exports.checkForgotPassword = promiseHandler(async (req, res, next) => {
  let token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  let user = await User.findOne({
    "token.token": token,
    "token.expiry": { $gte: Date.now() },
  }).select("+password");
  if (!user) {
    next(new CustomError(400, "Token is invalid or has expired."));
    return;
  }
  res.status(200).json({ status: "success", message: "Token is valid." });
});

exports.resetPassword = promiseHandler(async (req, res, next) => {
  let token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  let user = await User.findOne({
    "token.token": token,
    "token.expiry": { $gte: Date.now() },
  }).select("+password");

  if (!user) {
    next(new CustomError(400, "Token has expired."));
    return;
  }

  const { password } = req.body;

  if (password) {
    user.password = password;
    user.passwordChanged = Date.now();
    user = await user.save();
  }

  res.status(200).json({
    status: "success",
    message: "Password changed successfully.",
  });
});

exports.protect = promiseHandler(async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "failure",
      message: "Unauthenticated users",
    });
  }

  token = verifyToken(token);

  const user = await User.findById(token.id);
  if (!user) {
    return res.status(401).json({
      status: "failure",
      message: "User doesn't exist",
    });
  }

  if (await user.isPasswordUpdated(token.iat)) {
    return res.status(401).json({
      status: "failure",
      message: "Password changed recently",
    });
  }

  req.user = user;
  next();
});
