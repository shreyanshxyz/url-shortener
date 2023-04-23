import User from "../models/userModel.js";
import ShortUrl from "../models/urlModel.js";
import { createClient } from "redis";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdef", 8);

const client = createClient({
  password: process.env.REDIS_PASS,
  socket: {
    host: "redis-12924.c54.ap-northeast-1-2.ec2.cloud.redislabs.com",
    port: 12924,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

client.connect();

export const generateUrl = async (req, res) => {
  try {
    // The function starts by extracting the url property from the request body using destructuring.
    const { url } = req.body;

    // It checks whether the url already exists in Redis cache by calling the client.get function. If a value is found, the function returns a JSON response with the existing shortened URL.
    const value = await client.get(url);
    if (value) {
      return res.status(200).json({ url: value });
    }

    // If the url is not found in Redis cache, the function checks whether the url is empty or not. If it is empty, the function returns a JSON response with a 400 status code and a message indicating that the URL is required.
    if (!url) {
      res
        .status(400)
        .json({ message: "No URL found! Please Enter the URL Again!" });
    }

    // If the url is not empty, the function generates a shortened URL using the nanoid function, which creates a random string of characters with a specified length. In this case, the length of the string is set to 6.
    const shortenedUrl = nanoid(6);

    // The function creates a new ShortUrl document using the url, shortUrl, and UserId properties. The UserId property is set to the userId value from the request object, which was set by the authenticateToken middleware.
    let urlResult = await ShortUrl({
      url: url,
      shortUrl: shortenedUrl,
      UserId: req.userId,
    });

    // The function saves the new ShortUrl document to the database using the save method.
    await urlResult.save();

    // The function retrieves the current user from the database using the findOne method and the req.userId value.
    const user = await User.findOne({ _id: req.userId });

    // The function updates the user's urls array with the newly created ShortUrl document's _id property, and saves the updated user document to the database.
    if (user) {
      user.urls.push(urlResult._id);
      await user.save();
    }

    // The function sets the url and shortenedUrl as key-value pairs in Redis cache using the client.set function.
    await client.set(url, shortenedUrl);

    // The function returns a JSON response with the newly created ShortUrl document.
    res.status(200).json({ url: urlResult });
  } catch (error) {
    // If an error occurs, the function logs the error to the console and returns a JSON response indicating that the URL was not shortened, along with a message to check the console for further information.
    console.log(error);
    res.json({ message: "Url Not Shortened! Check Console for further info." });
  }
};

export const fetchUrl = async (req, res) => {
  try {
    const url = await ShortUrl.findOne({ shortUrl: req.params.shortUrl });
    if (!url) res.status(404).json({ message: "No URL Found!" });
    res.status(200).redirect(url.url);
  } catch (error) {
    console.log("message: ", error);
  }
};
