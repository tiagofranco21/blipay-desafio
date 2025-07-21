from flask import Blueprint
from blipay.api.restplus import api
from blipay.api.resources.loan import ns as loan_namespace


blueprintAPI = Blueprint("api", __name__, url_prefix="/api")
api.init_app(blueprintAPI, doc="/docs")

api.add_namespace(loan_namespace)

__all__ = ["blueprintAPI"]
