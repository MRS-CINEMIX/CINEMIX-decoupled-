# CINEMIX - Movie Recommender System

## About

Every time we go online, we are overwhelmed by the amount of choices we have.
Information is presented at a rate too fast a person can process. This overwhelming
information can take the user to the state of Information Overload. It is a state of having too
much information to make a choice or remain informed about a topic. Currently we are
having systems that recommend content based on the popularity, downloads, stability, etc.
Problem with these systems is that they are generalized to the public and not to a particular
user. We propose a critique based recommender system that uses Collaborative Filtering,
User Content and Clustering Algorithms like K-Means or Gaussian Mixture Models to
provide personalized recommendations to the user to decrease their information load. In
contrast to search-based approaches, critiquing based recommender systems will provide
more personalized recommendations based on the user. The movie critique system gives an
overall opinion of the movie by analyzing various reviews given by users and critics which
helps the viewers to see the popular opinion about a movie and let them know how well it
was received. Users can also give their own opinion about a movie and they can also suggest
movies. A highly visualized result helps users in understanding the ratings better. The earlier
approaches provided separate platforms for all these things but we have provided a one stop
platform to access all the features. The application will be loosely coupled making it easily
scalable.

## How to run the project?

### Run Flask server

1. Open the project directory and go into flaskr directory
```bash
$ cd flaskr/
```
2. Setup the virtual-environment and install all the dependencies from the `requirements.txt` file
```bash
$ python3 -m venv venv
$ . venv/bin/activate
$ pip install -r requirements.txt
```
3. Start the flask server
```bash
$ python app.py
```
4. Now open another terminal in the project directory while keeping the first one running and setup the nodejs server
```bash
$ npm install
```
5. Start nodejs server
```bash
$ node app.js
```
6. Go to your browser and type `http://localhost:3000/` in the address bar.
7. Congractulations !! thats it .

### Sources of the datasets 

1. [IMDB 5000 Movie Dataset](https://www.kaggle.com/carolzhangdc/imdb-5000-movie-dataset)
2. [The Movies Dataset](https://www.kaggle.com/rounakbanik/the-movies-dataset)
:: Download movies_metadata.csv and links_small.csv files from the above mentioned links and paste in /Data folder.  
    
### Setup

Add the required data in the `.env` file to access the environment variables in the project
```
MONGODBURI=<Your MongoDB URI>

PORT=3000

APIKEY=<Your OMDB API Key>
```
