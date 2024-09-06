import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Toggle subscription to a channel
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { subscriberId } = req.body;

  if (!isValidObjectId(channelId) || !isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid channel or subscriber ID");
  }

  const channel = await User.findById(channelId);
  const subscriber = await User.findById(subscriberId);

  if (!channel || !subscriber) {
    throw new ApiError(404, "Channel or subscriber not found");
  }

  // Check if the subscriber is already subscribed
  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: subscriberId,
  });

  if (existingSubscription) {
    // Unsubscribe if already subscribed
    await Subscription.deleteOne({
      channel: channelId,
      subscriber: subscriberId,
    });
    res.json(new ApiResponse({ message: "Unsubscribed successfully" }));
  } else {
    // Subscribe if not subscribed yet
    const subscription = new Subscription({
      channel: channelId,
      subscriber: subscriberId,
    });

    await subscription.save();
    res.status(201).json(new ApiResponse(subscription));
  }
});

// Get the list of subscribers for a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const subscribers = await Subscription.find({ channel: channelId })
    .populate("subscriber", "username email")
    .exec();

  res.json(new ApiResponse(subscribers));
});

// Get the list of channels a user has subscribed to
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  const subscriber = await User.findById(subscriberId);
  if (!subscriber) {
    throw new ApiError(404, "Subscriber not found");
  }

  const channels = await Subscription.find({ subscriber: subscriberId })
    .populate("channel", "username email")
    .exec();

  res.json(new ApiResponse(channels));
});

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
};
