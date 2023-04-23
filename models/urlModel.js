import mongoose, { Schema } from "mongoose";

const shortUrlSchema = new Schema({
  // url: A required string field that represents the original URL that will be shortened.
  url: {
    type: String,
    required: true,
  },
  // shortUrl: A required string field that represents the shortened URL that will be generated.
  shortUrl: {
    type: String,
    required: true,
  },
  // createdAt: A date field that represents the timestamp when the shortened URL was created. This field has a default value of the current date and time.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const model = mongoose.model("ShortUrl", shortUrlSchema);
export const schema = model.schema;
export default model;
