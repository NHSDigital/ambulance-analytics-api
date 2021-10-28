from urllib.parse import urlparse, parse_qs
from uuid import uuid4

import requests

from .auth_exception import AuthException


class SimulatedAuthCode:
    def __init__(self, auth_service_url: str, simulated_auth_url: str, client_id: str, redirect_url: str = "") -> None:
        self.__auth_service_base_url = auth_service_url
        self.__simulated_auth_base_url = simulated_auth_url
        self.__client_id = client_id
        self.__redirect_url = redirect_url  # if redirect_url else f"{self.__auth_service_base_url}/callback"

    def __get_state(self) -> str:
        state = uuid4()
        params = {
            "client_id": self.__client_id,
            "redirect_uri": self.__redirect_url,
            "response_type": "code",
            "state": state
        }
        res = requests.get(f"{self.__auth_service_base_url}/authorize", params=params)
        if res.status_code != 200:
            raise AuthException("Authorization failed", res)

        url = urlparse(res.url)

        return parse_qs(url.query)["state"][0]

    def __get_code(self, scope: str) -> str:
        state = self.__get_state()
        params = {
            "response_type": "code",
            "client_id": self.__client_id,
            "redirect_uri": self.__redirect_url,
            "scope": scope,
            "state": state
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        data = {"state": state}

        res = requests.post(f"{self.__simulated_auth_base_url}/simulated_auth",
                            params=params, headers=headers, data=data, allow_redirects=False)

        if res.status_code != 302:
            raise AuthException("Simulated Authentication failed", res)

        url = res.headers["Location"]
        res = requests.get(url, headers={"Auto-Test-Header": "flow-callback"}, allow_redirects=False)

        url = urlparse(res.url)
        return parse_qs(url.query)['code'][0]

    def authenticate(self, scope: str):
        pass
        # code = self.__get_code(scope)
        # res = requests.post(f"{self.__auth_service_base_url}/token")
