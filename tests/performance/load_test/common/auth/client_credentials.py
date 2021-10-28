import requests

from .auth_exception import AuthException
from .auth_model import create_jwt


class AuthClientCredentials:
    __client_assertion_type: str = "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"

    def __init__(self, auth_url: str, private_key_file: str = "", client_id: str = "", aud: str = "",
                 headers: dict = None,
                 alg="RS512") -> None:
        self.__auth_url = auth_url
        self.__client_id = client_id
        self.__aud = aud
        self.__headers = headers
        self.__alg = alg

        if private_key_file:
            with open(private_key_file, "r") as f:
                self.__signing_key = f.read()

    def get_access_token(self):
        _jwt = create_jwt(self.__signing_key, self.__client_id, self.__aud, self.__headers, self.__alg)
        data = {
            "client_assertion": _jwt,
            "client_assertion_type": self.__client_assertion_type,
            "grant_type": "client_credentials",
        }
        res = requests.post(f"{self.__auth_url}/token", data)

        if res.status_code != 200:
            raise AuthException("Authenticating with client credentials failed", res)

        return res.json()["access_token"]
