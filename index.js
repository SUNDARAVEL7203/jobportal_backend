import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.routes.js';
import companyRoute from './routes/company.routes.js';
import jobRoute from './routes/job.routes.js';
import applicationRoute from './routes/application.routes.js';

const app = express();
dotenv.config();

// Root route
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "I am from backend server",
        success: true
    });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS setup


const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}

app.use(cors(corsOptions));
// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});

//09asYq2yYaXsNOKa