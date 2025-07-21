from flask import request
from flask_restx import Resource
from blipay.api.schemas.loan import (
    loan_schema,
    loan_schema_list
)
from blipay.extensions import db, log
from blipay.services import (
    get_temperature_by_city,
    WeatherAPIError,
    calculate_credit_score,
    is_score_approved
)
from blipay.models.loan import Loan
from blipay.api.restplus import api

ns = api.namespace("loan", description="Operations related to loans")

@ns.route("/")
class LoanResource(Resource):
    @ns.expect(loan_schema, validate=True)
    def post(self):
        data = request.get_json()
        log.info(f"Received data: {data}")
        
        try:
            temperature = get_temperature_by_city(data["city"])
            log.info(
                f"City: {data["city"]}, Temp: {temperature}°C"
            )
        except WeatherAPIError as e:
            log.warning(f"Could not fetch weather info: {e}")
            error_obj = {
                "errors": {
                    "city": f"Não foi possível encontrar informações meteorológicas para {data['city']}"
                },
                "message": "Input payload validation failed"
            }
            
            return error_obj, 400
        
        score = calculate_credit_score(data["age"], data["monthlyIncome"], temperature)
        approved =is_score_approved(score)
        
        loan = Loan(
            name=data["name"],
            age=data["age"],
            monthly_income=data["monthlyIncome"],
            city=data["city"],
            cpf=data["cpf"],
            score=score,
            approved=approved
        )
        db.session.add(loan)
        db.session.commit()
        
        return {"score": score, "approved": approved}, 201

    @ns.param("cpf", "Filter by CPF", _in="query")
    @ns.marshal_list_with(loan_schema_list)
    def get(self):
        cpf = request.args.get("cpf")

        query = Loan.query
        if cpf:
            query = query.filter_by(cpf=cpf)

        loans = query.all()

        return [
            {
                "name": s.name,
                "age": s.age,
                "monthlyIncome": s.monthly_income,
                "city": s.city,
                "cpf": s.cpf,
                "score": s.score,
                "approved": s.approved
            } for s in loans
        ]