from flask import request, Response, jsonify
from functools import wraps
from api.models import Blog
from werkzeug.utils import secure_filename
import uuid, os, json, random, jwt


def random_auth():
    def _random_auth(f):
        @wraps(f)
        def __random_auth():
            try:
                token = request.headers['x-access-token']
            except:
                return {"Bad Request": "No token provided."},401
            try:
                jwt.decode(token, "+\x83\xb3\x84\xd6L\x95\x7f\\\xd9\x01\x8d$A\xdc\xb74\xbb\x16\xd0+\xd8\xb4\x1b",
                            algorithms='HS256')
                # data = json.loads(jsonify(Blog.objects()).get_data(as_text=False))
                data = Blog.objects.to_json()
                random_number = random.sample(range(0,len(data)),3)
                    
                return jsonify([data[random_number[0]], data[random_number[1]],data[random_number[2]]])
            except Exception as e:
                return {"Bad Request": str(e)},500
        return __random_auth
    return _random_auth



def api_auth():
    def _auth(f):
        @wraps(f)
        def __auth(*args, **kwargs):
            try:
                token = request.headers['x-access-token']
            except:
                return {"Bad Request": "No token provided."},401
            id = request.path.split('/')[-1]
            try:
                jwt.decode(token, "+\x83\xb3\x84\xd6L\x95\x7f\\\xd9\x01\x8d$A\xdc\xb74\xbb\x16\xd0+\xd8\xb4\x1b",
                           algorithms='HS256')
                return Blog.objects.filter(pk=id).search()
            except Exception as e:
                return {"Bad Request": str(e)},500
            return f()

        return __auth

    return _auth

def add_auth():
    def _add_auth(f):
        @wraps(f)
        def __add_auth(*args, **kwargs):
            try:
                token = request.headers['x-access-token']
            except:
                return {"Bad Request": "No token provided."},401
            try:
                data = eval(request.form['data'])
                content = str(request.form['content'])
                image = request.files['image']
                image_extension = image.filename.split(".")[-1]
                imagename = secure_filename(f"{str(uuid.uuid4())}.{image_extension}")
                try:
                    jwt.decode(token, "+\x83\xb3\x84\xd6L\x95\x7f\\\xd9\x01\x8d$A\xdc\xb74\xbb\x16\xd0+\xd8\xb4\x1b",
                               algorithms='HS256')
                    image.save(os.path.join(os.path.join("C:\\Users\\Abdulsamet\\Desktop\\Python\\Blog\\backend\\uploads"),
                                            imagename))
                    image_url = f"{request.base_url.split('/new')[0]}/%s" % imagename
                    return Blog(title=data['title'], author=data['author'],
                                description=data['description'], tags=data['tags'], content=content,
                                thumbnail=image_url).save().to_json()
                except Exception as e:
                    return {"Bad Request": str(e)},500
            except Exception as e:
                return {"Bad Request": str(e)},500
            return f(args, **kwargs)

        return __add_auth

    return _add_auth
