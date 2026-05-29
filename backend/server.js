require("dotenv").config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDb = require("./config/db");
const authRoutes  = require('./routes/authRoutes')
const userRoutes  = require('./routes/userRoutes')
const taskRoutes  = require('./routes/taskRoutes')
const reportRoutes  = require('./routes/reportRoutes');
const ClockRouter = require("./routes/ClockRoutes");
const roleRoutes  = require('./routes/rolesRoutes')
const salaryRoutes = require("./routes/salaryRoutes");
const resignationRoutes = require("./routes/resignation");
const dashboardRoutes = require("./routes/dashboardRoutes");
const superAdminAuthRoutes = require("./routes/superAdminAuthRoutes")
const superAdminRoutes = require("./routes/superAdminRoutes")
const companyRoutes = require("./routes/companyRoutes");
const superAdminDashbordRoutes = require("./routes/superAdminDashboardRoutes")
const paymentRoutes = require("./routes/paymentRoutes");





const app = express();


//Middleware to handle CORS
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:5173"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// connect database 
connectDb();

//Middleware
app.use(express.json())


app.get("/", (req, res) => {
    res.send("EMS Backend Running Successfully");
});
//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/clock", ClockRouter);
app.use("api/salary", salaryRoutes);
app.use("/api/resignation",resignationRoutes );
app.use("/api/roles", roleRoutes)
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/superauthadmin", superAdminAuthRoutes)
app.use("/api/company",companyRoutes );
app.use("/api/superadmindashboard", superAdminDashbordRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/payment", paymentRoutes);


// server upload folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
