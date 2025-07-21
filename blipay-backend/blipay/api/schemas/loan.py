from flask_restx import fields
from blipay.api.restplus import api

loan_schema = api.model(
    "Loan Schema",
    {
        "name": fields.String(required=True, description="Name"),
        "age": fields.Integer(required=True, min=18, description="Age"),
        "monthlyIncome": fields.Float(required=True, min=0, description="Monthly Income"),
        "city": fields.String(required=True, description="City"),
        "cpf": fields.String(required=True, description="Cpf"),
    },
)

loan_schema_list = api.clone(
    "Loan Schema List",
    loan_schema,
    {
        "score": fields.Integer(required=True, description="Score"),
        "approved": fields.Boolean(required=True, description="Approved"),
    },
)

