const { nanoid } = require('nanoid');
const db = require("../models");
const bcrypt = require('bcrypt');
const User = db.users;

const getUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email: email } });
  return user;
};

const getUserByUserId = async (id) => {
  const user = await User.findOne({ where: { id: id } });
  return user;
};

const getUserById = async (userId) => {
  const user = await User.findOne({ where: { id: userId } });
  return user;
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
  
    const userExist = await getUserByEmail(email)

    if (!userExist) {
      throw new Error(`Account not registered`);
    }

    const hashedPassword = userExist.dataValues.password

    const match = bcrypt.compare(password, hashedPassword);
    if (!match) {
      throw new Error(`Inccorect Password!`);
    }

    res.json({
      message: "Login success!",
      data: userExist.dataValues.id,
    });

  } catch (error) {

  }
}

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
      // console.log(regex);
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
    const userId = req.params.id; // Assuming the user ID is provided in the request params
    const user = await getUserById(userId); // Fetch the user by ID

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Perform updates based on the request body fields
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

    await user.save(); // Save the updated user
    res.json({ message: "User updated successfully.", data: user });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const userId = req.params.id; // Assuming the user ID is provided in the request params
    const user = await getUserByUserId(userId); // Fetch the user by ID

    if (!user) {
      throw res.status(404).json({ message: "User not found" });
    }

    await user.destroy(); // Delete the user
    res.json({ message: "User deleted successfully.", data: user });
  } catch (err) {
    next(err);
  }
};


