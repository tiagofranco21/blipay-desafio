import os
from dotenv import load_dotenv
import pytest
from blipay.factory import initialize_app
from blipay.extensions import db


@pytest.fixture
def app():
    # load OPENWEATHER_API_KEY from test.env
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "test.env"))
    
    app = initialize_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": os.getenv("DATABASE_URL", "sqlite:///:memory:")
    })

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()
