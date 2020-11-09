from flask import Flask, request, jsonify, render_template, url_for, redirect
import urllib.request
import pandas as pd
import numpy as np
import pickle
import json

# Init app
app = Flask(__name__, static_url_path='/static')

@app.route('/movies/recommend', methods=['POST'])
def recommend():
    # user_movies = [("Amazing Spider-Man, The (2012)",5),("Mission: Impossible III (2006)",4),("Toy Story 3 (2010)",2),("2 Fast 2 Furious (Fast and the Furious 2, The) (2003)",4)]
    # user_movies1 = []
    user_imdbid = request.json['user_movies']

    # print(user_movies1)

    ratings = pd.read_csv('data/ratings.csv')
    movies = pd.read_csv('data/movies.csv')
    links = pd.read_csv('data/links.csv')
    ratings = pd.merge(movies,ratings).drop(['genres','timestamp'],axis=1)
    links = pd.merge(links,movies)
    ratings.head()

    # user_imdbid = [['tt0848228', 4], ['tt4154756', 3], ['tt2395427', 4]]

    user_movies = []

    for x in user_imdbid:
        movie_title = links.loc[links['imdbId'] == int(x[0][2:]), 'title'].item()
        movie_params = (movie_title,x[1])
        user_movies.append(movie_params)

    print(user_movies)

    user_ratings = ratings.pivot_table(index=['userId'],columns=['title'],values='rating')
    user_ratings.head()

    user_ratings = user_ratings.dropna(thresh=10,axis=1).fillna(0)
    user_ratings.head()

    item_similarity_df = user_ratings.corr(method='pearson')
    item_similarity_df.head()

    def get_similar_movies(movie_name,user_rating):
        similar_score = item_similarity_df[movie_name]*(user_rating-2.5)
        similar_score = similar_score.sort_values(ascending=False)

        return similar_score

    # user_movies = [("Amazing Spider-Man, The (2012)",5),("Mission: Impossible III (2006)",4),("Toy Story 3 (2010)",2),("2 Fast 2 Furious (Fast and the Furious 2, The) (2003)",4)]

    similar_movies = pd.DataFrame()

    for movie,rating in user_movies:
        similar_movies = similar_movies.append(get_similar_movies(movie,rating),ignore_index=True)

    # similar_movies.head(10)

    recommendations = similar_movies.sum().sort_values(ascending=False).head(20)

    user_loved_movies = []

    for movie, rating in user_movies:
        user_loved_movies.append(movie)

    recommended_movies = []

    for movie,rating in recommendations.to_dict().items():
        if movie not in user_loved_movies:
            # print(movie)
            imdb_id = str(links.loc[links['title'] == movie, 'imdbId'].item()).zfill(7)
            json_obj=urllib.request.urlopen('http://www.omdbapi.com/?i=tt{}&apikey=29b25525'.format(imdb_id))
            data = json.load(json_obj)
            recommended_movies.append(data)
            # recommended_movies.append(imdb_id)

    print(recommended_movies)

    return json.dumps(recommended_movies)

@app.route('/movies/sentiment', methods=['POST'])
def sentiment():

    clf = pickle.load(open('nlp_model.pkl', 'rb'))
    vectorizer = pickle.load(open('transform.pkl','rb'))
    
    user_review = request.json['review']
    movie_review_list = np.array([user_review])
    movie_vector = vectorizer.transform(movie_review_list)
    pred = clf.predict(movie_vector)

    review_sentiment = {
        'review': user_review,
        'sentiment': 'Positive Review' if pred[0] else 'Negative Review'
    }

    return json.dumps(review_sentiment)

@app.route("/visualization",methods=['GET','POST'])
def hello():
	if request.method=='GET':
		return redirect(url_for('static',filename='visualization/hello.html'))


# Run Server
if __name__ == '__main__':
    app.run(debug=True)