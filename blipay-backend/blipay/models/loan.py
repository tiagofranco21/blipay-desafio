from blipay.extensions import db

class Loan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    monthly_income = db.Column(db.Float, nullable=False)
    city = db.Column(db.String(100), nullable=False)
    cpf = db.Column(db.String(14), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    approved = db.Column(db.Boolean, default=False) 
