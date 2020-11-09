# -*- coding: utf-8 -*-
"""sentiment-analysis.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/17w1ZsBwckPLBp88MuD2KbiFuUXGZgH6m
"""

import pandas as pd
import numpy as np
import nltk
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn import naive_bayes
from sklearn.metrics import roc_auc_score,accuracy_score
import pickle

nltk.download("stopwords")

dataset = pd.read_csv('data/reviews.txt',sep = '\t', names =['Reviews','Comments'])

stopset = set(stopwords.words('english'))

vectorizer = TfidfVectorizer(use_idf = True,lowercase = True, strip_accents='ascii',stop_words=stopset)

X = vectorizer.fit_transform(dataset.Comments)
y = dataset.Reviews
pickle.dump(vectorizer, open('transform.pkl', 'wb'))

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)

clf = naive_bayes.MultinomialNB()
clf.fit(X_train,y_train)

# accuracy_score(y_test,clf.predict(X_test))*100

clf = naive_bayes.MultinomialNB()
clf.fit(X,y)

# accuracy_score(y_test,clf.predict(X_test))*100

filename = 'nlp_model.pkl'
pickle.dump(clf, open(filename, 'wb'))

