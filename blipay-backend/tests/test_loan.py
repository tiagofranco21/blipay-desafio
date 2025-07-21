import pytest
from unittest.mock import patch
from blipay.services import WeatherAPIError, is_score_approved, get_temperature_by_city

VALID_PAYLOAD_APPROVED = {
    "name": "User Test",
    "age": 30,
    "monthlyIncome": 1800,
    "city": "Ibitinga",
    "cpf": "111.111.111-11"
}

VALID_PAYLOAD_REJECTED = {
    "name": "User Test",
    "age": 28,
    "monthlyIncome": 10,
    "city": "São Paulo",
    "cpf": "111.111.111-11"
}

INVALID_PAYLOAD = {
    "name": "User Test",
    "age": 30,
    "monthlyIncome": "0",
    "city": "Ibitinga",
    "cpf": "111.111.111-11"
}

def test_post_loan_success_approved(client):
    with patch("blipay.api.resources.loan.get_temperature_by_city", return_value=30):
        response = client.post("/api/loan/", json=VALID_PAYLOAD_APPROVED)
        assert response.status_code == 201
        data = response.get_json()
        assert data["score"] == 201
        assert data["approved"] == True
        
        
def test_post_loan_success_rejected(client):
    with patch("blipay.api.resources.loan.get_temperature_by_city", return_value=30):
        response = client.post("/api/loan/", json=VALID_PAYLOAD_REJECTED)
        assert response.status_code == 201
        data = response.get_json()
        assert data["score"] == 164
        assert data["approved"] == False


def test_post_loan_failed(client):
    with patch("blipay.api.resources.loan.get_temperature_by_city", return_value=30):
        response = client.post("/api/loan/", json=INVALID_PAYLOAD)
        assert response.status_code == 400
        data = response.get_json()
        assert "errors" in data
        assert "monthlyIncome" in data["errors"]


def test_post_loan_invalid_city(client):
    with patch("blipay.api.resources.loan.get_temperature_by_city", side_effect=WeatherAPIError(f"Failed to connect to weather service")):
        response = client.post("/api/loan/", json=VALID_PAYLOAD_APPROVED)
        assert response.status_code == 400
        data = response.get_json()
        assert "errors" in data
        assert "city" in data["errors"]


def test_get_loans_empty(client):
    response = client.get("/api/loan/")
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)
    assert len(response.get_json()) == 0


def test_get_loans_after_insert(client):
    # First, insert loans
    with patch("blipay.api.resources.loan.get_temperature_by_city", return_value=30):
        client.post("/api/loan/", json=VALID_PAYLOAD_APPROVED)
        
    with patch("blipay.api.resources.loan.get_temperature_by_city", return_value=30):
        client.post("/api/loan/", json=VALID_PAYLOAD_REJECTED)

    response = client.get(f"/api/loan/?cpf={VALID_PAYLOAD_APPROVED['cpf']}")
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 2
    
    assert data[0]["name"] == "User Test"
    assert data[0]["age"] == 30
    assert data[0]["monthlyIncome"] == 1800
    assert data[0]["cpf"] == "111.111.111-11"
    assert data[0]["city"] == "Ibitinga"
    assert data[0]["score"] == 201
    assert data[0]["approved"] == True
    
    assert data[1]["name"] == "User Test"
    assert data[1]["age"] == 28
    assert data[1]["monthlyIncome"] == 10
    assert data[0]["cpf"] == "111.111.111-11"
    assert data[1]["city"] == "São Paulo"
    assert data[1]["score"] == 164
    assert data[1]["approved"] == False


def test_get_loans_returns_empty_list_for_nonexistent_cpf(client):
    
    with patch("blipay.api.resources.loan.get_temperature_by_city", return_value=30):
        client.post("/api/loan/", json=VALID_PAYLOAD_APPROVED)

    # search for CPF that doesn't exist
    response = client.get(f"/api/loan/?cpf=111.111.111-12")
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 0


def test_is_score_approved():
    assert is_score_approved(400) is True
    assert is_score_approved(201.0) is True
    assert is_score_approved(200.0) is True
    assert is_score_approved(199.99) is False
    assert is_score_approved(10) is False


@pytest.mark.integration
def test_weather_api_valid_city():
    temperature = get_temperature_by_city("São Paulo")
    assert isinstance(temperature, float)
    assert -10 < temperature < 50


@pytest.mark.integration
def test_weather_api_invalid_city():
    with pytest.raises(WeatherAPIError):
        get_temperature_by_city("Cidade Inexistente")