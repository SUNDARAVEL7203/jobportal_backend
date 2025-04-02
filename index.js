import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv'
import connectDB from './utils/db.js';
import userRoute from './routes/user.routes.js'
import companyRoute from "./routes/company.routes.js";
import jobRoute from "./routes/job.routes.js";
import applicationRoute from "./routes/application.routes.js"
const app = express();

dotenv.config()

app.get("/", (req, res) => {
    return res.status(200).json({
        message:"I am from backend server",
        success : true
    })
})


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

const allowedOrigins = [
    'http://localhost:5173',
    'https://jobportal-frontend-psi.vercel.app'
  ];
  
  app.use(cors({
    origin: allowedOrigins,
    credentials: true,  // Enable cookies and other credentials across origins
  }));


const PORT = process.env.PORT || 5000;

app.use("/api/v1/user", userRoute)
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute)
app.use("/api/v1/application", applicationRoute)

app.listen(PORT, () =>{
    connectDB()
    console.log(`Server is running on port ${PORT}`);
})

//09asYq2yYaXsNOKa