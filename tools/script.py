from authlib.jose import jwk


def main():
    public_key = open('/files/jwtRS512.key.pub').read()
    jwks = jwk.dumps(public_key, kty='RSA', crv_or_size=4096, alg='RS512')
    print(jwks)


if __name__ == '__main__':
    main()
