const mongoose = require('mongoose');

let ReviewSchema = new mongoose.Schema({
    imdbid: {
        type: String,
        unique: true,
        required: true
    },
    reviews:[
        {
            author: {
                id: String,
                username: String
            },
            review: String,
            rating: Number,
            sentiment: String
        }
    ]
});

module.exports = mongoose.model('Review', ReviewSchema);