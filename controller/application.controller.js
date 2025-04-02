import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
    try {
        // Get the logged-in user's ID (assumed to be set by authentication middleware)
        const userId = req.id;
        
        // Get the job ID from request parameters
        const jobId = req.params.id;

        // Check if job ID is provided
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            });
        }

        // Check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job.",
                success: false
            });
        }

        // Check if the job exists in the database
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Create a new job application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        // Add the application reference to the job's applications array
        job.applications.push(newApplication._id);
        await job.save();

        // Return a success response
        return res.status(201).json({
            message: "Job applied successfully.",
            success: true
        });

    } catch (error) {
        console.log(error); // Log error for debugging
    }
};


export const getAppliedJobs = async (req, res) => {
    try {
        // Get the logged-in user's ID (assumed to be set by authentication middleware)
        const userId = req.id;

        // Find all job applications made by the user, sorted by newest first
        const application = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 }) // Sort applications in descending order of creation
            .populate({
                path: 'job', // Populate job details
                options: { sort: { createdAt: -1 } }, // Sorting at the job level (not necessary in populate)
                populate: {
                    path: 'company', // Populate company details within the job
                    options: { sort: { createdAt: -1 } }, // Sorting at the company level (not necessary in populate)
                }
            });

        // If no applications are found, return a 404 response
        if (!application || application.length === 0) {
            return res.status(404).json({
                message: "No applications found.",
                success: false
            });
        }

        // Return success response with the user's applied jobs
        return res.status(200).json({
            application,
            success: true
        });

    } catch (error) {
        console.log(error); // Log error for debugging
    }
};

export const getApplicants = async (req, res) => {
    try {
        // Get the job ID from request parameters
        const jobId = req.params.id;

        // Find the job by ID and populate the applications
        const job = await Job.findById(jobId).populate({
            path: 'applications', // Populate the applications related to the job
            options: { sort: { createdAt: -1 } }, // Sort applications by newest first
            populate: {
                path: 'applicant' // Populate applicant details within applications
            }
        });

        // If the job does not exist, return a 404 response
        if (!job) {
            return res.status(404).json({
                message: 'Job not found.',
                success: false
            });
        }

        // Return success response with job and its applicants
        return res.status(200).json({
            job,
            success: true // Fix spelling of 'success'
        });

    } catch (error) {
        console.log(error); // Log error for debugging
    }
};

export const updateStatus = async (req, res) => {
    try {
        // Extract the status from the request body
        const { status } = req.body;
        // Get the application ID from request parameters
        const applicationId = req.params.id;

        // Check if status is provided
        if (!status) {
            return res.status(400).json({
                message: 'Status is required.',
                success: false
            });
        }

        // Find the application by its ID
        const application = await Application.findOne({ _id: applicationId });

        // If application is not found, return a 404 response
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        // Update the status (convert to lowercase for consistency)
        application.status = status.toLowerCase();
        await application.save(); // Save the updated application status

        // Return success response confirming the update
        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });

    } catch (error) {
        console.log(error); // Log error for debugging
    }
};