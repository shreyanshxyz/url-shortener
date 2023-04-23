# URL Shortener
#### This is a Node.js application that shortens URLs using MongoDB for data storage and Redis for caching.

## Libraries Used
The application uses the following libraries:
- bcrypt: Used for password hashing to keep user data secure.
- cors: Used for Cross-Origin Resource Sharing (CORS), which allows the API to be accessed by clients on different domains.
- dotenv: Used to load environment variables from a .env file, making it easier to configure the application.
- express: A Node.js web application framework used to handle HTTP requests and responses.
- jsonwebtoken: Used for JSON Web Token (JWT) authentication to protect routes that require authorization.
- mongoose: An Object Data Modeling (ODM) library for MongoDB, used to model and access data.
- nanoid: Used to generate unique short URLs for each original URL.
- nodemon: A development tool that automatically restarts the application when changes are made.
- redis: An in-memory data structure store, used for caching frequent requests to improve application performance.

## Usage
1. To use the application, clone the repository and install the required dependencies using the following command:
```
npm install
```
2. Create a .env file with the following variables:
```
PORT=
MONGODB_URI=
JWT_SECRET=your-secret
REDIS_PASS=your-redis-password
```
3. Start the application with the following command:
```
npm start
```

## Routes
- POST /users/signup
    - Signs Up a new user.

- POST /users/signin
    - Authenticate a user and generate a JWT token.

- POST /
    - Shorten a URL (User Has to be Authenticated).

- GET /:shortUrl
    - Redirect to the original URL corresponding to the short URL.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
