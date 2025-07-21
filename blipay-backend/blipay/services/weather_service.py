import os
import requests
from typing import Optional


class WeatherAPIError(Exception):
    pass


def get_temperature_by_city(city: str) -> Optional[float]:
    """
    Calls the OpenWeatherMap API and returns the temperature for the given city.
    Raises WeatherAPIError on API failure or invalid city.
    """
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        raise WeatherAPIError("Missing OPENWEATHER_API_KEY environment variable.")

    url = "http://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": city,
        "appid": api_key,
        "units": "metric",
    }

    try:
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
    except requests.RequestException as e:
        raise WeatherAPIError(f"Failed to connect to weather service: {e}")

    data = response.json()

    if "main" not in data:
        raise WeatherAPIError(f"Unexpected response structure: {data}")

    return data["main"].get("temp")
