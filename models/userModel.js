import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  // name: a required string field that represents the user's name. The minlength option specifies that the name must be at least 3 characters long.
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  // email: a required string field that represents the user's email address. The match option uses a regular expression to ensure that the email address is valid.
  email: {
    type: String,
    required: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  // password: a required string field that represents the user's password. The minlength option specifies that the password must be at least 6 characters long, and the match option uses a regular expression to ensure that the password contains at least one lowercase letter, one uppercase letter, one digit, and one special character.
  password: {
    type: String,
    required: true,
    minlength: 6,
    match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/,
  },
  // urls: an array of ShortUrl objects. This field uses the ref option to establish a relationship between User and ShortUrl models.
  urls: [
    {
      type: Schema.Types.ObjectId,
      ref: "ShortUrl",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const model = mongoose.model("User", userSchema);
export const schema = model.schema;
export default model;
