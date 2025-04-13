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
    "http://127.0.0.1:8080",
    "http://localhost:5173",
    "https://jobportal-frontend-psi.vercel.app",
    "*"
  ];
  
  app.use(cors({
    origin: (origin, callback) => {
      // Check if the origin is in the allowed origins list or if there's no origin (for server-to-server requests)
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // if you are using cookies
  }));

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