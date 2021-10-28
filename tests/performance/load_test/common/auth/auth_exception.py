from requests import Response


class AuthException(Exception):
    def __init__(self, message: str, response: Response) -> None:
        self.message = message
        self.response = response

    def __str__(self) -> str:
        return f"""
        {self.message}
        url: {self.response.url}
        status code: {self.response.status_code}
        response body: {self.response.text or "[EMPTY]"}
        """
