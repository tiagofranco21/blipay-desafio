from blipay import app

if __name__ == "__main__":
    app.run(debug=app.config["FLASK_DEBUG"], port=app.config["PORT"])
