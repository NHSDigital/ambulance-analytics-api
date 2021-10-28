FROM python:3.7

WORKDIR /opt/app

COPY requirements.txt .

RUN pip3 install -r requirements.txt

COPY load_test .

EXPOSE 8089

CMD ["locust", "-f", "./locustfile.py"]