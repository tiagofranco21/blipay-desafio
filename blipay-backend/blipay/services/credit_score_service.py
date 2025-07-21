def age_component(age: int) -> float:
    """
    Score component based on age.
    """
    return age * 0.5


def income_component(monthly_income: float) -> float:
    """
    Score component based on monthly income.
    """
    return (monthly_income / 100) * 2


def temperature_component(temperature: float) -> float:
    """
    Score component based on city temperature.
    """
    return temperature * 5


def calculate_credit_score(age: int, monthly_income: float, temperature: float) -> float:
    """
    Calculates the final credit score based on individual components.
    """
    age_score = age_component(age)
    income_score = income_component(monthly_income)
    temp_score = temperature_component(temperature)

    return round(age_score + income_score + temp_score, 0)


def is_score_approved(score: float) -> bool:
    """
    Check if your credit score is sufficient to be approved.
    """
    return score >= 200