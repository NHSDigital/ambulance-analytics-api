from authlib.jose import jwk
import sys


def main():
    filename = sys.argv[1]
    public_key = open(f'/files/{filename}').read()
    jwks = jwk.dumps(public_key, kty='RSA', crv_or_size=4096, alg='RS512')
    print(jwks)


if __name__ == '__main__':
    main()
