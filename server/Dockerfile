FROM rayproject/ray:latest-py311

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . /code

EXPOSE 8000

EXPOSE 8265

CMD ["fastapi", "run", "main.py"]