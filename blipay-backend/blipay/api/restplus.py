from flask import current_app as app
from flask_restx import Api
from blipay.extensions import log


api = Api(
    version="1.0",
    title="Desafio Blipay API",
    doc="/docs"
)


@api.errorhandler
def default_error_handler(error):
    """
    Default error handler method

    :param error: error message
    :return: Message Error response
    """
    message = "An unhandled exception occurred."
    log.exception(message)
    log.exception(error)
    if not app.config["FLASK_DEBUG"]:
        return {"message": message}, 500
    return error
