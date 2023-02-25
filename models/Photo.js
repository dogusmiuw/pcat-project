const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
// formdaki nameler ile schemadaki attributelarin isimleri birebir ayni olmali
const PhotoSchema = new Schema({
    title: String,
    description: String,
    image: String,
    dateCreated: {
        type: Date,
        default: Date.now()
    }
});

// create model
const Photo = mongoose.model("Photo", PhotoSchema);

module.exports = Photo;
