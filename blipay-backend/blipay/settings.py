import os
from dotenv import load_dotenv

load_dotenv(override=True)

ENV = os.getenv("ENV", "development")
FLASK_DEBUG = ENV == "development"
PORT = os.getenv("PORT", 5000)

# SQLite settings
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
SQLITE_PATH = os.path.join(BASE_DIR, os.getenv("DATABASE_URL", "storage/app.db"))
SQLALCHEMY_DATABASE_URI = f"sqlite:///{SQLITE_PATH}"
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Flask-Restplus settings
SWAGGER_UI_DOC_EXPANSION = "list"
RESTPLUS_VALIDATE = True
RESTPLUS_MASK_SWAGGER = False
RESTX_ERROR_404_HELP = False
