const express = require("express");
const path = require("path");
const connectToDB = require("./config/connect");
const authRoutes = require("./routes/api/authRoutes");
const userRoutes = require("./routes/api/userRoutes");
const authPages = require("./routes/views/authPages");
const userPages = require("./routes/views/userPages");
const homePage = require("./routes/views/homePage");
const expressLayout = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const { localUser } = require("./middlewares/authMiddleware");

require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;
connectToDB();

//middlewares
app.use(cookieParser());
app.use(expressLayout);
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(localUser);
app.use(express.static("public"));
app.use('/uploads', express.static('uploads'));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/auth", authPages);
app.use("/user", userPages);
app.use("/", homePage);

app.listen(PORT,() => {
    console.log(`App is running on Port ${PORT}`);
})