import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.routes.js';
import companyRoute from './routes/company.routes.js';
import jobRoute from './routes/job.routes.js';
import applicationRoute from './routes/application.routes.js';


dotenv.config();

const app = express();

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



  const PORT = process.env.PORT || 5000;


  const allowedOrigins = [
    "http://localhost:5173",
    "https://jobportal-frontend-psi.vercel.app",
    
  ];
  
  app.use(cors({
    origin: allowedOrigins,
    credentials: true,
  }));// credintials true is give to send the cookies in response
  

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Server listen

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});

//09asYq2yYaXsNOKa