import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/videos.model.js";
import { User } from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Get All Videos with pagination, sorting, and filtering
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = 'createdAt', sortType = 'desc', userId } = req.query;
    
    let filter = {};
    if (query) {
        filter.title = { $regex: query, $options: 'i' };
    }
    if (userId) {
        filter.User = userId;
    }

    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortType === 'desc' ? -1 : 1 };

    const videos = await Video.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit));

    const totalVideos = await Video.countDocuments(filter);

    res.status(200).json(new ApiSuccess(200, {
        videos,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalVideos / limit),
            totalItems: totalVideos
        }
    }, "Videos retrieved successfully"));
});

// Publish a new Video
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const videoFile = req.file?.path;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }
    if (!videoFile) {
        throw new ApiError(400, "Video file is required");
    }

    const uploadedVideo = await uploadOnCloudinary(videoFile);

    const video = await Video.create({
        title,
        description,
        videoUrl: uploadedVideo.url,
        user: req.user._id
    });

    res.status(201).json(new ApiSuccess(201, video, "Video published successfully"));
});

// Get Video by ID
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    res.status(200).json(new ApiSuccess(200, video, "Video retrieved successfully"));
});

// Update Video details
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId, 
        { title, description }, 
        { new: true }
    );

    if (!updatedVideo) {
        throw new ApiError(404, "Video not found");
    }

    res.status(200).json(new ApiSuccess(200, updatedVideo, "Video updated successfully"));
});

// Delete Video
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findByIdAndDelete(videoId, $);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    res.status(200).json(new ApiSuccess(200, null, "Video deleted successfully"));
});

// Toggle Publish Status of Video
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    res.status(200).json(new ApiSuccess(200, video, `Video publish status toggled to ${video.isPublished}`));
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
};
