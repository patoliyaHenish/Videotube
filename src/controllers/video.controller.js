import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// const getAllVideos = asyncHandler(async (req, res) => {
//     const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
//     //TODO: get all videos based on query, sort, pagination
// })

// const publishAVideo = asyncHandler(async (req, res) => {
//     const { title, description} = req.body
//     // TODO: get video, upload to cloudinary, create video
// })

// const getVideoById = asyncHandler(async (req, res) => {
//     const { videoId } = req.params
//     //TODO: get video by id
// })

// const updateVideo = asyncHandler(async (req, res) => {
//     const { videoId } = req.params
//     //TODO: update video details like title, description, thumbnail

// })

// const deleteVideo = asyncHandler(async (req, res) => {
//     const { videoId } = req.params
//     //TODO: delete video
// })

// const togglePublishStatus = asyncHandler(async (req, res) => {
//     const { videoId } = req.params
// })

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  const filter = query
    ? {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      }
    : {};

  if (userId) {
    filter.user = userId;
  }

  const videos = await Video.find(filter)
    .populate("user")
    .sort({ [sortBy]: sortType })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .exec();

  res.json(new ApiResponse(videos));
});

// Publish a video (upload to Cloudinary and save video)
const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, userId } = req.body;
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const result = await uploadOnCloudinary(req.file.path);
  if (!result) {
    throw new ApiError(500, "Cloudinary upload failed");
  }

  const video = new Video({
    title,
    description,
    videoUrl: result.secure_url,
    user: user._id,
    thumbnail: result.secure_url.replace(".mp4", ".jpg"), // Generating a thumbnail link (assuming it's available)
  });

  await video.save();
  res.status(201).json(new ApiResponse(video));
});

// Get video by ID
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId).populate("user").exec();
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  res.json(new ApiResponse(video));
});

// Update video details
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId).exec();
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (title) video.title = title;
  if (description) video.description = description;

  if (req.file) {
    const result = await uploadOnCloudinary(req.file.path);
    if (result) {
      video.videoUrl = result.secure_url;
      video.thumbnail = result.secure_url.replace(".mp4", ".jpg");
    }
  }

  await video.save();
  res.json(new ApiResponse(video));
});

// Delete a video
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findByIdAndDelete(videoId).exec();
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  res.json(new ApiResponse({ message: "Video deleted successfully" }));
});

// Toggle publish status (published/unpublished)
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId).exec();
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  res.json(new ApiResponse({ videoId, isPublished: video.isPublished }));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
