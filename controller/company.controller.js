import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";


export const registerCompany = async (req, res) => {
    try {
        // Extract company name from request body
        const { companyName } = req.body;

        // Check if company name is provided
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        // Check if the company already exists in the database
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register the same company.",
                success: false
            });
        }

        // Create a new company with the provided name and associate it with the user
        company = await Company.create({
            name: companyName,
            userId: req.id // Assuming req.id contains the authenticated user's ID
        });

        // Return a success response with the newly created company details
        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });
    } catch (error) {
        console.log(error); // Log error for debugging
    }
};

export const getCompany = async (req, res) => {
    try {
        // Retrieve the logged-in user's ID (assumed to be set by authentication middleware)
        const userId = req.id;

        // Fetch all companies associated with the logged-in user
        const companies = await Company.find({ userId });

        // If no companies are found, return a 404 response
        if (!companies || companies.length === 0) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            });
        }

        // Return success response with the retrieved companies
        return res.status(200).json({
            companies,
            success: true
        });
    } catch (error) {
        console.log(error); // Log error for debugging
    }
};


export const getCompanyById = async (req, res) => {
    try {
        // Extract company ID from request parameters
        const companyId = req.params.id;

        // Find the company by its ID in the database
        const company = await Company.findById(companyId);

        // If the company does not exist, return a 404 response
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        // Return success response with the found company details
        return res.status(200).json({
            company,
            success: true
        });
    } catch (error) {
        console.log(error); // Log error for debugging
    }
};

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
 
        const file = req.file;
        // idhar cloudinary ayega
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;
 

        const updateData = { name, description, website, location, logo };
        
        console.log(name, description, website, location, logo);

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            message:"Company information updated.",
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}