const express = require("express");
const fileUpload = require("express-fileupload");
const ejs = require("ejs");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const app = express();

// CONTROLLERS
const photoController = require("./controllers/photoController");
const pageController = require("./controllers/pageController");

// connect db
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/pcat-deneme-db");

// template engine
app.set("view engine", "ejs");

// middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(
    methodOverride("_method", {
        methods: ["POST", "GET"],
    })
);

// ROUTES
app.get("/", photoController.getAllPhotos);
app.get("/photos/:id", photoController.getPhoto);
app.post("/photos", photoController.createPhoto);
app.put("/photos/:id", photoController.updatePhoto);
app.delete("/photos/:id", photoController.deletePhoto);

app.get("/about", pageController.getAboutPage);
app.get("/add", pageController.getAddPage);
app.get("/update/:id", pageController.getUpdatePage);

const port = 3000;

app.listen(port, () => {
    console.log("Server started at: " + port);
});
