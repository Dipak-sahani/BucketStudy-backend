import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from './routes/user.routes.js'
import employerRouter from './routes/employee.routes.js'
import payrollRouter from './routes/payroll.routes.js'
//routes declaration
//app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/users", userRouter)
app.use("/api/employee", employerRouter)
app.use("/api/payroll", payrollRouter)




// http://localhost:8000/api/v1/users/register

export { app }