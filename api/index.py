import os

from pymongo import MongoClient
from fastapi import FastAPI, Request
from pydantic import BaseModel

app = FastAPI()

# cluster=MongoClient(os.environ["MONGO"])
# db=cluster['']

class Password(BaseModel):
    uid: int
    provider: str
    account: str
    password: str
    color: int


@app.get("/api/ping")
def ping():
    return {"message": "Pong"}  # Always return as Dictionary (JSON)


@app.post("/api/create/{userid}")
async def add_key(userid: str, item: Request): 
    data = await item.json()

    uid = data['uid']
    provider = data['provider']
    account = data['account']
    password = data['password']
    color = data['color']  # this ranges from 0 to 4
    
    #post={provider:data['provider'],account:data['account'],password:data['password'],color:data['color']}
    #collection.insert_one(post)
    
    return {"userid": userid, "status": "success", "code": 1}


@app.get("/api/fetch/{userid}")
def fetch_key(userid: str):
    # collection=db[userid]
    # for results in collection.find({},{"_id":0}):
    #     print(results)

    return {"keys": [
        {
            "uid": "Ai32Sdg",
            "provider": "Google",
            "account": "justdummy@gmail.com",
            "password": "U2FsdGVkX1/K4dkTdonH0WKA6ddlpoq+XgU5kIB/S8/5JIQ5FEZg1Mu/CD5+p02a",
            "color": 0
        },
        {
            "uid": "3AksgG3",
            "provider": "Facebook",
            "account": "rahuletto",
            "password": "U2FsdGVkX1/K4dkTdonH0WKA6ddlpoq+XgU5kIB/S8/5JIQ5FEZg1Mu/CD5+p02a",
            "color": 1
        },
        {
            "uid": "HsgaH4d",
            "provider": "Twitter",
            "account": "rahul",
            "password": "U2FsdGVkX1/K4dkTdonH0WKA6ddlpoq+XgU5kIB/S8/5JIQ5FEZg1Mu/CD5+p02a",
            "color": 3
        },
        {
            "uid": "MksyhWS",
            "provider": "Google",
            "account": "fakeaccount@gmail.com",
            "password": "U2FsdGVkX1/K4dkTdonH0WKA6ddlpoq+XgU5kIB/S8/5JIQ5FEZg1Mu/CD5+p02a",
            "color": 4
        },
        {
            "uid": "QgASgWg",
            "provider": "MongoDB",
            "account": "mongo-account",
            "password": "U2FsdGVkX1/K4dkTdonH0WKA6ddlpoq+XgU5kIB/S8/5JIQ5FEZg1Mu/CD5+p02a",
            "color": 2
        },
        {
            "uid": "GHdshes",
            "provider": "Reddit",
            "account": "redditman",
            "password": "U2FsdGVkX1/K4dkTdonH0WKA6ddlpoq+XgU5kIB/S8/5JIQ5FEZg1Mu/CD5+p02a",
            "color": 5
        },
        {
            "uid": "WgshWa",
            "provider": "SRMIST",
            "account": "srmman",
            "password": "U2FsdGVkX1/K4dkTdonH0WKA6ddlpoq+XgU5kIB/S8/5JIQ5FEZg1Mu/CD5+p02a",
            "color": 1
        }
    ]}


@app.delete("/api/delete/{userid}/{uid}")
def delete_key(userid: str, uid: str):
    # collection.delete_one({'userid':userid, 'uid': uid})
    return {"status": "success", "code": 1}


@app.patch("/api/edit/{userid}/{uid}")
def edit_key(userid: str, uid: str):
    return {"status": "success", "code": 1}

@app.get("/api/getpin/{userid}")
async def validate_pin(userid: str):
    pin = "1234"
    return {"pin": pin}

@app.patch("/api/editpin/{userid}")
async def edit_pin(userid: str, item: Request):
    data = await item.json()

    pin = data.pin
    # Encrypting would be an overkill so i passed it normally.

    # Save it and return success code
    return {"status": "success", "code": 1}

@app.post("/api/new/{userid}")
async def new_user(userid: str, item: Request):
    data = await item.json()

    pin = data.pin
    # Save like this { userid: "", pin: "", keys: [ {...} ] }

    # Save it and return success code
    return {"status": "success", "code": 1}