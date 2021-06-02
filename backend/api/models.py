import mongoengine as db
from flask import jsonify
import datetime
import jwt


translationTable = str.maketrans("ğĞıİöÖüÜşŞçÇ", "gGiIoOuUsScC")


class QuerySet(db.QuerySet):
    def search(self):
        value = self[0]
        data = {
            "title": value.title,
            "author": value.author,
            "date": value.date,
            "tags": value.tags,
            "description": value.description.translate(translationTable),
            "thumbnail": value.thumbnail,
            "content": value.content,
        }
        return data


class Blog(db.Document):
    title = db.StringField(required=True)
    content = db.StringField(required=True)
    date = db.DateTimeField(default=datetime.datetime.utcnow)
    author = db.StringField(required=True)
    description = db.StringField(required=True)
    tags = db.ListField()
    thumbnail = db.StringField(required=True)
    meta = {'   collection': 'Blog', 'queryset_class': QuerySet}

    def to_json(self):
        return {
            "_id": str(self.pk),
            "title": self.title,
            "date": self.date,
            "author": self.author,
            "description": self.description,
            "tags": self.tags,
            "content": self.content,
            "thumbnail": self.thumbnail
        }


class UserQuerySet(db.QuerySet):
    def search(self, accessToken):
        value = self[0]
        data = {
            "username": value.username,
            "accessToken": accessToken
        }
        return data
    def get_hash_password(self):
        return {
            "password": self[0].password
        }

    def encode_auth_token(self):
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1, seconds=0),
                'iat': datetime.datetime.utcnow(),
                'sub': self[0].username
            }
            return jwt.encode(
                payload,
                "+\x83\xb3\x84\xd6L\x95\x7f\\\xd9\x01\x8d$A\xdc\xb74\xbb\x16\xd0+\xd8\xb4\x1b",
                algorithm='HS256'
            )
        except Exception as e:
            return e


class User(db.Document):
    username = db.StringField(required=True, unique=True)
    password = db.StringField(required=True)
    email = db.EmailField(required=True,unique=True)
    meta = {'collection': 'User', 'queryset_class': UserQuerySet}

    def to_json(self):
        return {
            "message": "User created",
            "success": True
        }

    def encode_auth_token(self):
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1, seconds=0),
                'iat': datetime.datetime.utcnow(),
                'sub': str(self.pk)
            }
            return jwt.encode(
                payload,
                "+\x83\xb3\x84\xd6L\x95\x7f\\\xd9\x01\x8d$A\xdc\xb74\xbb\x16\xd0+\xd8\xb4\x1b",
                algorithm='HS256'
            )
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        try:
            payload = jwt.decode(auth_token,
                                 "+\x83\xb3\x84\xd6L\x95\x7f\\\xd9\x01\x8d$A\xdc\xb74\xbb\x16\xd0+\xd8\xb4\x1b")
            return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'

    def hash_password(self, password):
        self.password = password.decode("utf-8")