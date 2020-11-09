const express = require('express');
const router = express.Router({mergeParams: true});
const fetch = require('node-fetch');
const Review = require('../models/review');
const Movie = require('../models/movie');

router.get('/home',(req,res) => {
    res.render('movies/home', {
        pageTitle: 'Home Page',
        path: '/home'
    });
});

// Perfect
router.post('/results',(req,res) => {
    const search = req.body.search;
    fetch(`http://www.omdbapi.com/?type=movie&s=${search}&apikey=${process.env.APIKEY}`)
    .then(data => data.json())
    .then(json => {
        console.log(json);
        res.render('movies/results', {
            moviesData:json,
            pageTitle: 'Search Results',
            path: '/results'
        });
    }).catch(err => {
        console.log(err);
    });
});

// Perfect
router.get('/info/:imdbId',(req,res) => {
    const imdbId = req.params.imdbId;
    fetch(`http://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.APIKEY}`)
    .then(data => data.json())
    .then(json => {
        console.log(json);
        res.render('movies/info', {
            movieData:json,
            pageTitle: 'Search Results',
            path: `/info/${imdbId}`
        });
    }).catch(err => {
        console.log(err);
    });
});

router.post('/info/:imdbId',(req,res) => {
    const imdbid = req.params.imdbId;
    const rating = req.body.rating;
    const review = req.body.review;
    const body = { review }; 

    console.log('rating ------>',rating);

    const searchReview = (nameKey, myArray) => {
        for (var i=0; i < myArray.length; i++) {
            if (myArray[i].author.id == nameKey) {
                return myArray[i];
            }
        }
    }

    const searchMovie = (nameKey, myArray) => {
        for (var i=0; i < myArray.length; i++) {
            if (myArray[i].imdbid === nameKey) {
                return myArray[i];
            }
        }
    }

    console.log('body',body);

    fetch('http://127.0.0.1:5000/movies/sentiment', {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(data => data.json())
    .then(json => {
        console.log(json);

        const author = {
            id: req.user._id,
            username: req.user.username
        }
        const newReview = {
            author,
            review,
            rating,
            sentiment: json.sentiment
        }

        // const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        Review.findOne({imdbid})
            .then(foundReview => {
                console.log('foundReview after finding - ', foundReview);
                if(!foundReview){
                    foundReview = new Review({
                        imdbid: imdbid,
                        reviews: []
                    });
                    console.log('new found review - ',foundReview);
                }

                let searchReviewObject = searchReview(req.user._id, foundReview.reviews);
                if(!searchReviewObject){
                    console.log('Review not found!');
                    foundReview.reviews.push(newReview);
                } else {
                    console.log('Review found!');
                    searchReviewObject.review = review;
                    searchReviewObject.rating = rating;
                    searchReviewObject.sentiment = json.sentiment;
                }

                foundReview.save();
                
                Movie.findOne({ "author.id": req.user._id })
                    .then(foundMovies => {
                        console.log('foundMovies after finding - ',foundMovies);
                        if(!foundMovies){
                            foundMovies = new Movie({
                                author: author,
                                movies: []
                            });
                        }
                        console.log('foundMovies after creating new one - ',foundMovies);
                        let searchMovieObject = searchMovie(imdbid, foundMovies.movies);
                        console.log('searchMovieObj - ', searchMovieObject);
                        if(!searchMovieObject){
                            console.log('Movie not found!');
                            foundMovies.movies.push({imdbid,rating});
                        } else {
                            console.log('Movie found!')
                            searchMovieObject.rating = rating;
                        }
                        foundMovies.save();
                        console.log('foundMovies after save - ',foundMovies);
                        return res.redirect('/recommendations');
                    })
            })
    })
    .catch(err => {
        console.log(err);
    });
});
    
// Perfect
router.get('/recommendations',(req,res) => {
    Movie.findOne({ "author.id": req.user._id })
        .then(foundMovie => {
            console.log('foundMovie from /recommendations', foundMovie);
            if(!foundMovie){
                return res.redirect('/home');
            }  
            const body = {
                user_movies: []
            }
            foundMovie.movies.forEach(movie => {
                body.user_movies.push([movie.imdbid,movie.rating]);
            });
            console.log('body after converting - ',body);
            return body;
        })
        .then(body => {
            if(!body){
                return res.redirect('/home');
            } else {
                fetch('http://127.0.0.1:5000/movies/recommend', {
                    method: 'post',
                    body: JSON.stringify(body),
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(data => data.json())
                .then(json => {
                    console.log(json);
                    res.render('movies/recommendations', {
                        moviesData: json,
                        pageTitle: 'Movie Recommendations',
                        path: '/recommendations'
                    });
                })
            }
        })  
        .catch(err => {
            console.log(err);
        })
});

// Perfect
router.get('/reviews/:imdbId',(req,res) => {
    Review.findOne({ imdbid: req.params.imdbId })
        .then(foundReviews => {
            console.log('foundReviews - ',foundReviews)
            res.render('movies/reviews', {
                reviews: foundReviews, 
                pageTitle: 'Movie Reviews',
                path: `/reviews/${req.params.imdbId}`
            });
        })
        .catch(err => {
            console.log(err);
        });
});


router.get('/visualize', (req,res) => {
    res.redirect('/visualization/hello.html');
})

module.exports = router;