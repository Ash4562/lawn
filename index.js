// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
const path = require("path");
// const cookieParser = require("cookie-parser")
// require("dotenv").config({ path: "./.env" });



// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URL);

// const app = express();

// // Middlewares
// app.use(express.json())
// app.use(express.static(path.join(__dirname, "dist")));
// app.use(cors({
//     origin: "http://localhost:5000",
//     // origin: ["https://lawn-b3su.onrender.com", "http://localhost:5173"],// Adjust according to your frontend URL
//     credentials: true
// }));
// app.use(cookieParser())

// app.use("/api/auth", require("./routes/authRoute"))
// app.use("/api/banquet", require("./routes/BanquetRoute"));
// // Routes for both booking types
// app.use("/api/booking", require("./routes/booking.routes")); // Route for general bookings

// // Catch-all for unmatched routes
// app.use("*", (req, res) => {
//     res.status(404).json({
//         message: "404 resource not found"
//     })
//     // res.sendFile(path.join(__dirname, "dist", "index.html"))
// });

// // Global error handler
// app.use((err, req, res, next) => {
//     console.log(err);
//     return res.status(500).json({ message: err.message || "Something went wrong" });
// });

// // Server start
// mongoose.connection.once("open", () => {
//     console.log("Mongoose Connecteds");
//     app.listen(process.env.PORT, () => {
//         console.log("Server running");
//     });
// });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser")
require("dotenv").config({ path: "./.env" });



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL);

const app = express();
app.use(express.static(path.join(__dirname, "dist")));
// Middlewares
app.use(express.json());
app.use(cors({
    origin: "https://lawn-b3su.onrender.com", // Adjust according to your frontend URL
    credentials: true
}));
app.use(cookieParser())

app.use("/api/auth", require("./routes/authRoute"))
app.use("/api/banquet", require("./routes/BanquetRoute"));
// Routes for both booking types
app.use("/api/booking", require("./routes/booking.routes")); // Route for general bookings

// Catch-all for unmatched routes
app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"))
    // res.status(404).json({ message: "Resource Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.log(err);
    return res.status(500).json({ message: err.message || "Something went wrong" });
});

// Server start
mongoose.connection.once("open", () => {
    console.log("Mongoose Connected");
    app.listen(process.env.PORT, () => {
        console.log("Server running");
    });
});
