import { Job } from "../models/job.model.js";


export const postJob = async (req, res) => {
    try {
        // Extract job details from request body
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id; // Get user ID from authentication middleware

        // Validate if all required fields are provided
        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            });
        };

        // Create a new job entry in the database
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","), // Convert requirements from comma-separated string to an array
            salary: Number(salary), // Ensure salary is stored as a number
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId, // Associate job with a company
            created_by: userId // Store the user who created the job
        });

        // Send success response with created job details
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error); // Log error for debugging
    }
};

// Controller to fetch all jobs (for students)
export const getAllJobs = async (req, res) => {
    try {
        // Get search keyword from query parameters (default is an empty string)
        const keyword = req.query.keyword || "";

        // Define search query to find jobs based on title or description
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } }, // Case-insensitive search in job title
                { description: { $regex: keyword, $options: "i" } }, // Case-insensitive search in job description
            ]
        };

        // Fetch jobs from database, populate company details, and sort by newest first
        const jobs = await Job.find(query).populate({
            path: "company" // Populate company details in the response
        }).sort({ createdAt: -1 }); // Sort jobs in descending order of creation time

        // If no jobs found, return a 404 response
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            });
        };

        // Send success response with retrieved jobs
        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.log(error); // Log error for debugging
    }
};
// student
// student
export const getJobById = async (req, res) => {
    try {
        // Extract job ID from request parameters
        const jobId = req.params.id;

        // Find the job by ID and populate the "applications" field to include related application details
        const job = await Job.findById(jobId).populate({
            path: "applications"
        });

        // If job is not found, return a 404 response
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        };

        // Send success response with job details
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error); // Log error for debugging
    }
};

export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}