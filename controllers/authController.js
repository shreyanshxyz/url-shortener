import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const signUp = async (req, res) => {
  try {
    // The controller extracts the name, email, and password fields from the request body using object destructuring.
    const { name, email, password } = req.body;

    // The controller checks if a user with the given email already exists in the database using User.findOne(). If a user with the email already exists, it returns a 409 Conflict response with an error message.
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    // If the email is available, the controller hashes the password using bcrypt.hash() with a salt of 10 rounds.
    const hashedPassword = await bcrypt.hash(password, 10);

    // A new User instance is created with the name, email, and hashed password.
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // The new User instance is saved to the database using user.save().
    const savedUser = await user.save();

    // If the user is successfully saved, a JSON web token (JWT) is generated using jwt.sign(), which includes the user's _id and the JWT_SECRET from the environment variables.
    let accessToken = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);

    return res.status(201).json({ accessToken });
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // This line searches for a user in the database that matches the email address provided. User refers to a model in the application that represents the collection in the database where user data is stored.
    const user = await User.findOne({ email });

    //If no user was found in the previous step, this block of code executes.
    // It returns a 401 status code (Unauthorized) and a JSON object with a message property indicating that the email or password is invalid.
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // This line compares the password provided in the request with the password stored in the database for the user.
    // The compare() function is part of the bcrypt library and returns a boolean indicating whether the two passwords match.
    const match = await bcrypt.compare(password, user.password);

    // If the password comparison fails, this block of code executes.
    // It returns a 401 status code (Unauthorized) and a JSON object with a message property indicating that the email or password is invalid.
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // This line generates a JSON Web Token (JWT) that can be used to authenticate future requests from the client.
    // jwt.sign() is a function from the jsonwebtoken library that generates a JWT. It takes two arguments:
    // An object containing any data that needs to be included in the JWT. In this case, it's the user's MongoDB _id property.
    // A secret key used to sign the JWT. In this case, it's a value stored in an environment variable for security reasons.
    let accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // If Successful, This line returns a 200 status code (OK) and a JSON object containing the access token generated in the previous step.
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
