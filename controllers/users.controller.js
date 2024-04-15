const { nanoid } = require('nanoid');
const db = require("../models");
const bcrypt = require('bcrypt');
const path = require('path')
const TokenManager = require('../tokenize/TokenManager');
const fs = require('fs');
const { addRefreshToken } = require('./authentications.controller');
const User = db.users;
const UserImage = db.userImages;
const Authentication = db.authentications;

const getUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email: email } });
  return user;
};

const getUserByUserId = async (id) => {
  const user = await User.findOne({ where: { id: id } });
  return user;
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userExist = await getUserByEmail(email);
    if (!userExist) {
      throw new Error(`Account not registered`);
    }
    const hashedPassword = userExist.dataValues.password;

    const match = await bcrypt.compare(password, hashedPassword); // Await here

    if (!match) {
      throw new Error(`Incorrect Password!`);
    }
    const accessToken = TokenManager.generateAccessToken(userExist.dataValues.id);
    const refreshToken = TokenManager.generateRefreshToken(userExist.dataValues.id);

    var userImage
    // Find user image associated with the logged-in user
    userImage = await UserImage.findOne({ where: { userId: userExist.id } });

    await Authentication.create({ token: refreshToken });

    res.status(201).json({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
        userImage,
      },
    });
  } catch (error) {
    next(error); // Forward the error to the error handling middleware
  }
};

exports.create = async (req, res, next) => {
  try {
    // req.body.role = "user"
    const validationRules = {
      firstName: /^[a-zA-Z]+$/,
      lastName: /^[a-zA-Z]+$/,
      phoneNumber: /^\d+$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      password: /^(?=.*[a-zA-Z])(?=.*[0-9]).*$/, // Requires at least one letter and one number
      role: /^user$/
    };

    const validateField = (fieldName, value) => {
      const regex = validationRules[fieldName];
      if (!regex.test(value)) {
        throw new Error(`Invalid ${fieldName} format`);
      }
    };

    const requiredFields = ["firstName", "lastName", "phoneNumber", "email", "password", "role"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        throw new Error(`${field} cannot be empty`);
      }
      validateField(field, req.body[field]);
    }


    const emailExist = await getUserByEmail(req.body.email);
    if (emailExist) {
      throw new Error("Email is already registered");
    }

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = {
      id: id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role
    };

    const createdUser = await User.create(user);
    if (!createdUser) {

      throw new Error("User created failed");
    }

    if (req.file) {
      const userImage = {
        url: req.file.filename,
        userId: id
      }

      const createdUserImage = await UserImage.create(userImage)

      if (!createdUserImage) {
        throw new Error("Image User created failed");
      }
    }

    res.json({
      message: "User created successfully.",
      data: createdUser,
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;

    // Verify the bearer token and get the user ID
    const userId = TokenManager.verifyRefreshToken(bearerHeader);

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await getUserByUserId(userId);

    // Update user information
    if (req.body.firstName) {
      user.firstName = req.body.firstName;
    }
    if (req.body.lastName) {
      user.lastName = req.body.lastName;
    }
    if (req.body.phoneNumber) {
      user.phoneNumber = req.body.phoneNumber;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }

    // Handle photo update
    if (req.file) {
      // Delete any existing photo from server
      const existingUserImage = await UserImage.findOne({ where: { userId: userId } });
      if (existingUserImage && existingUserImage.url) {
        const filePath = path.join(__dirname, '..', 'public/images', existingUserImage.url);
        await fs.unlinkSync(filePath); // Delete the file
        await existingUserImage.destroy(); // Delete the database record
      }

      // Create new photo record
      const userImage = {
        url: req.file.filename,
        userId: userId
      };
      await UserImage.create(userImage);
    }

    // Save the updated user to the database
    await user.save();

    res.json({ message: "User updated successfully.", data: user });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;

    // Verify the bearer token and get the user ID
    const userId = TokenManager.verifyRefreshToken(bearerHeader);

    const user = await getUserByUserId(userId)

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete photo file from server
    const userImage = await UserImage.findOne({ where: { userId: userId } });
    if (userImage && userImage.url) {
      const filePath = path.join(__dirname, '..', 'public/images', userImage.url);
      await fs.unlinkSync(filePath);
    }

    // Delete database records
    await user.destroy();
    await UserImage.destroy({ where: { userId: userId } }); // Delete any associated images

    res.json({ message: "User deleted successfully.", data: user });
  } catch (err) {
    next(err);
  }
};

