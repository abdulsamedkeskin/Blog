from flask import Flask, request, send_file
from flask_mongoengine import MongoEngine
from api.models import Blog, User
import os
from flask_cors import CORS, cross_origin
from middleware.middleware import add_auth, api_auth
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.config['MONGODB_SETTINGS'] = {
    "db": "Blog",
    "host": "mongodb+srv://admin:F1Yj7vYlhRwyQCRS@blog.c6ed1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    "username": "admin",
    "password": "F1Yj7vYlhRwyQCRS"
}

CORS(app)
bcrypt = Bcrypt(app)
app.config['CORS_HEADERS'] = 'Content-Type'

db = MongoEngine(app)

UPLOAD_FOLDER = os.path.join("C:\\Users\\Abdulsamet\\Desktop\\Python\\Blog\\backend\\uploads")
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/new', methods=["POST"])
@add_auth()
def add():
    try:
        print("")
    except Exception as e:
        return {"Bad Request": str(e)},500


@app.route('/api/<id>', methods=['GET'])
@api_auth()
def get_data():
    try:
        print("")
    except Exception as e:
        return {"Bad Request": str(e)},500

@app.route("/api", methods=['GET'])
@api_auth()
def getAllData():
    try:
        print()
    except Exception as e:
        return {"Bad Request": str(e)},500

@app.route('/signup', methods=['POST'])
def signUp():
    data = request.get_json()
    try:
        instance = User(username=data['username'], password=data['password'],
                        email=data['email'])
        instance.hash_password(bcrypt.generate_password_hash(data['password']))
        instance.save()
        return instance.to_json()
    except Exception as e:
        return {"Bad Request": str(e)},500


@app.route("/signin", methods=['POST'])
def signIn():
    data = request.get_json()
    try:
        hash_password = User.objects.filter(username=data['username']).get_hash_password()
        if bcrypt.check_password_hash(pw_hash=hash_password['password'],password=data['password']):
            user = User.objects.filter(username=data['username'])
            token = user.encode_auth_token()
            response = user.search(token)
            return response
        else:
            return {"Bad Request": "Kullanıcı adı veya şifre yanlış"},500
    except Exception as e:
        return {"Bad Request": str(e)},500


@app.route('/<file_name>')
def main(file_name):
    try:
        return send_file(os.path.join(app.config['UPLOAD_FOLDER'], file_name))
    except FileNotFoundError:
        return {"Bad Request": "File not found"}, 500


if __name__ == "__main__":
    app.run(debug=True)
