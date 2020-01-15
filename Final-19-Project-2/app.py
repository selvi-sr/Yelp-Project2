from flask import Flask, jsonify, render_template, flash, request
from pymongo import MongoClient
import pandas as pd

app = Flask(__name__)

conn_str = "mongodb+srv://yelpdbuser:yelpdbuser@cluster0-vm3s6.mongodb.net/test?retryWrites=true&w=majority"
conn = MongoClient(conn_str,27017)
# conn = MongoClient('localhost',27017)
db = conn.yelp_db

@app.route("/")
def index():
    htmlTag ="""<html>
                <table>  
                    <tr>
                        <td> GET List of cities in USA data </td>
                        <td> /CityList </td>
                    </tr>           
                    <tr>
                        <td> GET ATL Rating summary </td>
                        <td> /ATLRating </td>
                    </tr>
                    <tr>
                        <td> GET ATL Review counts </td>
                        <td> /ATLReviewCount </td>
                    </tr>
                    <tr>
                        <td> GET SFO Rating summary </td>
                        <td> /SFORating </td>
                    </tr>
                    <tr>
                        <td> GET SFO Review counts </td>
                        <td> /SFOReviewCount </td>
                    </tr>
                    <tr>
                        <td> GET USA Rating summary </td>
                        <td> /USARating </td>
                    </tr>
                    <tr>
                        <td> GET selected City Rating summary </td>
                        <td> /CITYRatingSummary </td>
                        <td> Use Attribute:  </td>
                        <td> ?city= </td>
                    </tr>
                    <tr>
                        <td> Example </td>
                        <td> /CITYRatingSummary?city=Pittsburgh </td>
                    </tr>

                <table>
                <html>
            """
    return htmlTag

@app.route("/CityList")
def getCityList():
    try:      
        data = db.Biz_USA_data

        cities = data.distinct('city')

        return jsonify(cities)
    except Exception as e:
        print(e)
        return None

@app.route("/ATLRating")
def getATLRating():
    try:      
        data = db.Biz_ATL_data

        rating_ct_atl = data.aggregate([
            {
                '$group': {
                    '_id': '$Rating',
                    'count': {
                        '$sum': 1
                    }
                }
            }
        ])

        return jsonify(list(rating_ct_atl))
    except Exception as e:
        print(e)
        return None

@app.route("/ATLReviewCount")
def getATLReviewCt():
    try:      
        data = db.Biz_ATL_data
        review_ct = []
        review_ct_atl = data.find({},{ 
            'Name': 1,
            'Rating': 1,
            'Review_Count':1,
            '_id':0 
            })

        for r in review_ct_atl:
            review_ct.append(r)

        return jsonify(review_ct)
    except Exception as e:
        print(e)
        return None
@app.route("/SFORating")
def getSFORating():
    try:
        data = db.Biz_SFO_data

        rating_ct_sfo = data.aggregate([
            {
                '$group': {
                    '_id': '$Rating',
                    'count': {
                        '$sum': 1
                    }
                }
            }
        ])

        return jsonify(list(rating_ct_sfo))
    except Exception as e:
        print(e)
        return None 

@app.route("/SFOReviewCount")
def getSFOReviewCt():
    try:      
        data = db.Biz_SFO_data
        review_ct = []
        review_ct_sfo = data.find({},{ 
            'Name': 1,
            'Rating': 1,
            'Review_Count':1,
            '_id':0 
            })

        for r in review_ct_sfo:
            review_ct.append(r)

        return jsonify(review_ct)
    except Exception as e:
        print(e)
        return None

    
@app.route("/USARating")
def getUSARating():
    try:
        data = db.Biz_USA_data

        rating_ct_usa = data.aggregate([
            {
                '$group': {
                    '_id': '$stars',
                    'count': {
                        '$sum': 1
                    }
                }
            }
        ])

        return jsonify(list(rating_ct_usa))
    except Exception as e:
        print(e)
        return None  

@app.route("/CITYRatingSummary")
def getSelectedCityRating():
    try:
        city = request.args.get('city')
        data = db.Biz_USA_data
        response = []
        city_data = data.aggregate([
            {
                '$match': {
                    'city': city
                    }
            },
            {
                '$group': {
                    '_id': '$stars',
                    'count': {
                        '$sum': 1
                    }
                }
            }
        ])
        for c in city_data:
            response.append(c)
        # print(c)
        return jsonify(response)
    except Exception as e:
        print(e)
        return None

@app.route("/CITYReviews")
def getSelectedCityReviews():
    try:
        city = request.args.get('city')
        data = db.Biz_USA_data
        city_data = data.find({
            'city':city
            },{ 
                'name': 1,
                'stars': 1,
                'review_count':1,
                '_id':0 
                })
        
        return jsonify(list(city_data))
    except Exception as e:
        print(e)
        return None


if __name__ == '__main__':
    app.run()
