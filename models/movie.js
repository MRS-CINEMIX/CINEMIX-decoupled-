const mongoose = require('mongoose');

let MovieSchema = new mongoose.Schema({
    author: {
        id: String,
        username: String
    },
    movies:[
        {
            imdbid: {
                type: String,
                required: true
            },
            rating: Number
        }
    ]
});

module.exports = mongoose.model('Movie', MovieSchema);