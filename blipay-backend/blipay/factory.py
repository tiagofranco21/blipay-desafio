import os
from flask import Flask
from flask_cors import CORS
from blipay.api import blueprintAPI
from blipay.extensions import db


def initialize_app():
    """Application factory, used to create application"""
    app = Flask("blipay")
    CORS(app)
    
    os.makedirs("blipay/storage", exist_ok=True)

    app.config.from_object("blipay.settings")

    app.register_blueprint(blueprintAPI)
    
    db.init_app(app)
    with app.app_context():
        db.create_all()

    return app
