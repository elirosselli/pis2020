from fastapi import FastAPI
from fastapi.responses import RedirectResponse

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/redirectme/")
def redirect_me():
    return RedirectResponse('http://www.google.com')