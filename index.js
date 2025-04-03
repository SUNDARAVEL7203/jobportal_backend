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
const allowedOrigins = [
    "http://localhost:5173",  // <--- KEEP THIS
    "https://jobportal-frontend-psi.vercel.app", 
    "https://jobportal-frontend-git-main-sundaravels-projects-633e20b1.vercel.app",
    "https://jobportal-frontend-f2nbh1jbx-sundaravels-projects-633e20b1.vercel.app"
  ];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

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