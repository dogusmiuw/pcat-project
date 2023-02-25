const Photo = require("../models/Photo");
const fs = require("fs");

exports.getAllPhotos = async (req, res) => {
    const page = req.query.page || 1;
    const photosPerPage = 6;
    const totalPhotos = await Photo.find().countDocuments();

    const photos = await Photo.find()
        .sort("-dateCreated")
        .skip((page - 1) * photosPerPage)
        .limit(photosPerPage);

    res.render("index", {
        photos,
        current: page,
        totalPage: Math.ceil(totalPhotos / photosPerPage),
    });

    // console.log(req.query);
    // const photos = await Photo.find().sort("-dateCreated");
    // res.render("index", { photos });
};

exports.getPhoto = async (req, res) => {
    // console.log(req.params.id);
    const photo = await Photo.findById(req.params.id);
    res.render("photo", { photo });
};

exports.createPhoto = async (req, res) => {
    // console.log(req.files.image.name);

    // file upload control
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
    }

    const uploadDirPath = "./public/uploads";

    if (!fs.existsSync(uploadDirPath)) {
        fs.mkdirSync(uploadDirPath);
    }

    let file;
    let uploadPath;

    file = req.files.image;
    uploadPath = "./public/uploads/" + file.name;

    file.mv(uploadPath, async () => {
        await Photo.create({
            ...req.body,
            image: "/uploads/" + file.name,
        });
        res.redirect("/");
    });
};

exports.updatePhoto = async (req, res) => {
    const photo = await Photo.findById(req.params.id);
    photo.title = req.body.title;
    photo.description = req.body.description;
    photo.save();
    res.redirect("/photos/" + req.params.id);
};

exports.deletePhoto = async (req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id });
    let delFilePath = "./public" + photo.image;

    if (fs.existsSync(delFilePath)) {
        fs.unlinkSync(delFilePath);
    }
    await Photo.findByIdAndDelete(req.params.id);

    res.redirect("/");
};
