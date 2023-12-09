const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");
const signupController = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      // return res.status(400).send("all fields are required");
      return res.send(error(400, "All fields are required"));
    }

    const olduser = await User.findOne({ email });
    if (olduser) {
      // return res.status(409).send("User is already registered");
      return res.send(error(409, "User is already registered"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log(user);
    // return res.send(success(201, "user created successfully"));
    return res.send(success(201, "user created successfully"));
  } catch (e) {
    console.log(e);
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      // return res.status(400).send("All fields are required");
      return res.send(error(400, "All fields are required"));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      // return res.status(404).send("User is not registered");
      return res.send(error(404, "User is not registered"));
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      // return res.status(403).send("Incorrect password");
      return res.send(error(403, "incorrect password"));
    }

    const accessToken = generateAccessToken({
      _id: user._id,
    });

    const refreshToken = generateRefreshToken({
      _id: user._id,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.send(success(200, { accessToken }));
  } catch (e) {
    console.log(e);
  }
};

// this api will check the refreshToken validity and generate a new access token
const refreshAccessTokenController = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies.jwt) {
    // return res.status(401).send("Refresh token in cookies is required");
    return res.send(error(401, "Refresh token in cookie is required"));
  }

  const refreshToken = cookies.jwt;

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );
    const _id = decoded._id;
    const accessToken = generateAccessToken({ _id });

    // return res.status(201).json({ accessToken });
    return res.send(success(201, { accessToken }));
  } catch (e) {
    console.log(e);
    // res.status(401).send("Invalid refresh token");
    return res.send(error(401, "Invalid refresh token"));
  }
};

const logoutController = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.send(success(200, "user logged out"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

// internal functions
const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "1d",
    });
    console.log(token);
    return token;
  } catch (e) {
    console.log(e);
  }
};

const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });
    console.log(token);
    return token;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  loginController,
  signupController,
  refreshAccessTokenController,
  logoutController,
};
