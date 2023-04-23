import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  try {
    // Inside the function, the token variable is initialized with the value of the Authorization header from the incoming request.
    let token = req.headers.authorization;

    // The if statement checks whether the token exists, and if so, it extracts the JWT value by splitting the token string on the space character and selecting the second part (the actual token).
    if (token) {
      token = token.split(" ")[1];
      let user = jwt.verify(token, process.env.JWT_SECRET); // The jwt.verify function is used to decode the JWT value, using the JWT secret key stored in the environment variable JWT_SECRET.

      // If the decoding is successful, the user ID extracted from the decoded token is assigned to the userId property of the request object (req.userId).
      req.userId = user.id;
    } else {
      // If the token is not found, the function sends an HTTP response with status code 401 and a JSON message "Unauthorized , token not found".
      res.status(401).json({ message: "Unauthorized, token not found" });
    }
    // The next function is called to pass control to the next middleware function
    next();
  } catch (error) {
    console.log(error);
    // If there is an error during decoding or the token is invalid, the function sends an HTTP response with status code 401 and a JSON message "User Is Not Authorized".
    res.status(401).json({ message: "User Is Not Authorized" });
  }
};
