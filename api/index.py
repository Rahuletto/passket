"""
API using Python language
"""
from pymongo import MongoClient
from fastapi import FastAPI, Request
from pydantic import BaseModel, Json

app = FastAPI()

"""
Using FastAPI so here is the docs 'other person'
https://fastapi.tiangolo.com/tutorial/first-steps/
"""

cluster=MongoClient("mongodb+srv://passket:marbanshan01@cluster0.pqifnpk.mongodb.net/?retryWrites=true&w=majority")
db=cluster['']


class Password(BaseModel):
    '''The format of password i will provide to the api. This is to make things TypeSafe.'''
    provider: str  # Google
    account: str  # myemail@gmail.com
    password: str  # lolItsASecret
    color: int  # Just to fancy things up


@app.get("/api/ping")
def ping():
    '''Just an ordinary ping endpoint to test if things work well'''

    return {"message": "Pong"}  # Always return as Dictionary (JSON)


@app.post("/api/create/{userid}")
async def add_key(userid: str, item: Request): 
    data = await item.json()

    provider = data['provider']
    account = data['account']
    password = data['password']
    color = data['color']  # this ranges from 0 to 4
    
    #post={provider:data['provider'],account:data['account'],password:data['password'],color:data['color']}
    #collection.insert_one(post)
    

    return {"userid": userid, "status": "success", "code": 1}


@app.get("/api/fetch/{userid}")
def fetch_key(userid: str):
    '''Returns all key possible from the user. ALL ARE ENCRYPTED !'''
    collection=db[userid]
    for results in collection.find({},{"_id":0}):
        print(results)
    
    # Test data in here
    return {"keys": [
        {
            "provider": "Google",
            "account": "justdummy@gmail.com",
            "password": "passwordIsASecretShush",
            "color": 0
        },
        {
            "provider": "Facebook",
            "account": "rahuletto",
            "password": "ennaDaPaakura",
            "color": 1
        },
        {
            "provider": "Twitter",
            "account": "rahul",
            "password": "twitterIsNowCalledX",
            "color": 3
        },
        {
            "provider": "Google",
            "account": "fakeaccount@gmail.com",
            "password": "password@12345",
            "color": 4
        },
        {
            "provider": "MongoDB",
            "account": "mongo-account",
            "password": "MongoDbisGood#!%W@%",
            "color": 2
        },
        {
            "provider": "Reddit",
            "account": "redditman",
            "password": "RedditIsFun",
            "color": 5
        },
        {
            "provider": "SRMIST",
            "account": "srmman",
            "password": "okok",
            "color": 1
        }
    ]}  # Return list of Password dictionary type [index.py#L14]


@app.delete("/api/delete/{userid}/{provider}/{account}")
def delete_key(userid: str, provider: str, account: str):
    '''Delete the key'''
    collection.delete_one({'userid':str})
    # So get the exact key they ask using user id, provider name and account name from database and do. Ill provide the correct one
    return {"status": "success", "code": 1}


@app.patch("/api/edit/{userid}/{provider}/{account}")
def edit_key(userid: str, provider: str, account: str):
    '''Delete the key'''
    
    # Edit the key ok va
    return {"status": "success", "code": 1}

@app.post("/api/getpin/{userid}")
async def validate_pin(userid: str, item: Request):
    data = await item.json()

    pin = data.pin
    # Encrypting would be an overkill so i passed it normally.

    # if pin == database.pin
    if pin: return {"status": "success", "code": 1}
    else: return {"status": "fail", "code": 0}

@app.post("/api/savepin/{userid}")
async def save_pin(userid: str, item: Request):
    data = await item.json()

    pin = data.pin
    # Encrypting would be an overkill so i passed it normally.

    # Save it and return success code
    return {"status": "success", "code": 1};