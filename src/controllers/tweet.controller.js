import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new Tweet
const createTweet = asyncHandler(async (req, res) => {
  const { userId, content } = req.body;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const tweet = new Tweet({
    content,
    user: user._id,
  });

  await tweet.save();
  res.status(201).json(new ApiResponse(tweet));
});

// Get all Tweets of a specific user
const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const tweets = await Tweet.find({ user: userId }).populate("user").exec();
  res.json(new ApiResponse(tweets));
});

// Update a specific Tweet
const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findById(tweetId).exec();
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  tweet.content = content || tweet.content;

  await tweet.save();
  res.json(new ApiResponse(tweet));
});

// Delete a specific Tweet
const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findByIdAndDelete(tweetId).exec();
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  res.json(new ApiResponse({ message: "Tweet deleted successfully" }));
});

export {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
};
