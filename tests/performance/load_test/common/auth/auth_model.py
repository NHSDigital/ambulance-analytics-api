from time import time
from typing import NamedTuple
from uuid import uuid4

import jwt


class Claims(NamedTuple):
    sub: str
    iss: str
    aud: str
    exp: int
    jti: str

    def dict(self):
        return self._asdict()

    @staticmethod
    def new(client_id: str, aud: str, valid_for_sec=5):
        return Claims(
            sub=client_id,
            iss=client_id,
            aud=aud,
            jti=str(uuid4()),
            exp=int(time()) + valid_for_sec,
        )


def create_jwt(
    signing_key: str, client_id: str, aud: str, headers: dict, alg="RS512"
) -> str:
    claims = Claims.new(client_id, aud).dict()

    return jwt.encode(claims, signing_key, headers=headers, algorithm=alg)
