FROM python:3

COPY ./script.py /script.py
COPY ./requirements.txt /requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

CMD [ "python", "./script.py" ]
