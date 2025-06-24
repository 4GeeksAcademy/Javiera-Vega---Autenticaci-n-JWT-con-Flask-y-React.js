"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException, send_email
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from base64 import b64encode
import os
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta

api = Blueprint('api', __name__)


def create_password(password, salt):
    return generate_password_hash(f"{password}{salt}")


def check_password(password_hash, password, salt):
    return check_password_hash(password_hash, f"{password}{salt}")


expires_token = 20
expires_delta = timedelta(minutes=expires_token)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route("/signup", methods=["POST"])
def new_user():
    data = request.json
    email = data.get("email", None)
    name = data.get("name", None)
    password = data.get("password", None)
    # recordatorio: genera caracteres aleatorios, puede incorporar ñ, acentos, etc.
    salt = b64encode(os.urandom(32)).decode("utf-8")

    if email is None or name is None or password is None:
        return jsonify("You need to add your email, name and password"), 400

    user = User()
    user.email = email
    user.name = name
    user.password = create_password(password, salt)
    user.salt = salt

    db.session.add(user)

    try:
        db.session.commit()
        return jsonify("User created successfully")
    except Exception as error:
        db.session.rollback()
        return jsonify(f"Error: {error}"), 500


@api.route("/login", methods=["POST"])
def login_start():
    data = request.json
    email = data.get("email", None)
    password = data.get("password", None)

    if email is None or password is None:
        return jsonify("You need to add your email and password"), 400
    else:
        user = User.query.filter_by(email=email).first()
        if user is None:
            return jsonify("Credentials failure"), 400
        else:
            if check_password(user.password, password, user.salt):
                token = create_access_token(identity=str(user.id))
                return jsonify({
                    "token": token}), 200
            else:
                return jsonify("Credentials failure"), 400


@api.route("/users", methods=["GET"])
@jwt_required()
def all_users():
    users = User.query.all()
    return jsonify(list(map(lambda item: item.serialize(), users))), 200


@api.route("/user-login", methods=["GET"])
@jwt_required()
def one_user_login():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)
    if user is None:
        return jsonify("User not found"), 404
    else:
        return jsonify(user.serialize())


@api.route("/reset-password", methods=["POST"])
def reset_password_user():
    body = request.json

    user = User.query.filter_by(email=body).one_or_none()

    if user is None:
        return jsonify("User not found"), 404

    create_token = create_access_token(
        identity=body, expires_delta=expires_delta)

    message_url = f""" 
    <a href="{os.getenv("FRONTEND_URL")}/reset-password?token={create_token}">Recuperar contraseña</a>
"""
    data = {
        "subject": "Password recovery",
        "to": body,
        "message": message_url
    }

    sended_email = send_email(
        data.get("subject"), data.get("to"), data.get("message"))

    if sended_email:
        return jsonify("message sent successfully"), 200
    else:
        return jsonify("Error"), 400


@api.route("/update-password", methods=["PUT"])
@jwt_required()
def update_password_user():
    user_id = get_jwt_identity()
    body = request.get_json()

    user = User.query.filter_by(id=user_id).first()

    if user is not None:
        salt = b64encode(os.urandom(32)).decode("utf-8")
        new_password = body.get("new_password", None)

        if not new_password:
            return jsonify({"Error": "The password was not updated"}), 400
        
        password = create_password(new_password, salt)

        user.salt = salt
        user.password = password

        try:
            db.session.commit()
            return jsonify("password changed successfuly"), 201
        except Exception as error:
            db.session.rollback()
            return jsonify("Error"), 500
    else:
        return jsonify({"Error": "Usuario no encontrado"}), 404
