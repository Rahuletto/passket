"""
API using Python language
"""
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

"""
Using FastAPI so here is the docs 'other person'
https://fastapi.tiangolo.com/tutorial/first-steps/
"""


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
def add_key(userid: str, item: Password):
    '''This adds the password or key to the database'''

    if not item or not item.provider or not item.account or not item.password:
        return {"status": "fail", "code": 0, "item": item}

    # WIP
    # So this is how we going to store. User ID (30 characters long) will be the primary key and all the passwords should be stored as a list (array)
    provider = item.provider
    account = item.account
    password = item.password

    color = item.color  # this ranges from 0 to 4

    # 0 - White
    # 1 - Blue
    # 2 - Green
    # 3 - Yellow
    # 4 - Violet
    # 5 - Red

    # Return Success or Fail after save. Code is a bool. 0 for fail and 1 for success
    return {"status": "success", "code": 1}


@app.get("/api/fetch/{userid}")
def fetch_key(userid: str):
    '''Returns all key possible from the user. ALL ARE ENCRYPTED !'''

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
        }
    ]}  # Return list of Password dictionary type [index.py#L14]


@app.delete("/api/delete/{userid}/{provider}/{account}")
def delete_key(userid: str, provider: str, account: str):
    '''Delete the key'''

    # So get the exact key they ask using user id, provider name and account name from database and do. Ill provide the correct one
    return {"status": "success", "code": 1}
