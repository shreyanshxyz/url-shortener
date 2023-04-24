import express from "express";
import {} from "dotenv/config";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute.js";
import urlRoute from "./routes/urlRoute.js";

const app = express();
app.use(express.json());

try {
  await mongoose
    .connect(process.env.connection_url)
    .then(() => console.log("Connected to Database Succesfully!"));
} catch (error) {
  console.log(error);
}

app.use("/users", authRoute);
app.use("/", urlRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, (req, res) => {
  console.log("Server Running");
});
