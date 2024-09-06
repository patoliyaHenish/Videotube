import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Toggle like on a video
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { userId } = req.body;

  if (!isValidObjectId(videoId) || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid video or user ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const existingLike = await Like.findOne({ video: videoId, user: userId });

  if (existingLike) {
    await Like.deleteOne({ video: videoId, user: userId });
    res.json(new ApiResponse({ message: "Unliked video" }));
  } else {
    const like = new Like({ video: videoId, user: userId });
    await like.save();
    res.status(201).json(new ApiResponse(like));
  }
});

// Toggle like on a comment
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  if (!isValidObjectId(commentId) || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid comment or user ID");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const existingLike = await Like.findOne({ comment: commentId, user: userId });

  if (existingLike) {
    await Like.deleteOne({ comment: commentId, user: userId });
    res.json(new ApiResponse({ message: "Unliked comment" }));
  } else {
    const like = new Like({ comment: commentId, user: userId });
    await like.save();
    res.status(201).json(new ApiResponse(like));
  }
});

// Toggle like on a tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { userId } = req.body;

  if (!isValidObjectId(tweetId) || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid tweet or user ID");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const existingLike = await Like.findOne({ tweet: tweetId, user: userId });

  if (existingLike) {
    await Like.deleteOne({ tweet: tweetId, user: userId });
    res.json(new ApiResponse({ message: "Unliked tweet" }));
  } else {
    const like = new Like({ tweet: tweetId, user: userId });
    await like.save();
    res.status(201).json(new ApiResponse(like));
  }
});

// Get all liked videos by a user
const getLikedVideos = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const likes = await Like.find({ user: userId, video: { $exists: true } })
    .populate("video")
    .exec();

  res.json(new ApiResponse(likes));
});

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
};
