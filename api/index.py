import os

from pymongo import MongoClient
from fastapi import FastAPI, Request
from pydantic import BaseModel

app = FastAPI()

cluster=MongoClient('mongodb+srv://passket:marbanshan01@cluster0.pqifnpk.mongodb.net/?retryWrites=true&w=majority')
db=cluster['passket']

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

    cl=db.list_collection_names()
    for i in cl:
        if i==userid:
            collection=db[userid]
            if collection.count_documents({}) ==0:
                post={'userid':userid,'keys':[{'uid':uid,'provider':provider,'account':account,'password':password,'color':color}]}
                collection.insert_one(post)
            else:
                collection.update_one({},{"$push":{'keys':{'uid':uid,'provider':provider,'account':account,'password':password,'color':color}}})
            break
        else:
            db.create_collection(userid)
            collection=db[userid]
            post={'userid':userid,'keys':[{'uid':uid,'provider':provider,'account':account,'password':password,'color':color}]}
            collection.insert_one(post)


    
    #post={provider:data['provider'],account:data['account'],password:data['password'],color:data['color']}
    #collection.insert_one(post)
    
    return {"userid": userid, "status": "success", "code": 1}


@app.get("/api/fetch/{userid}")
def fetch_key(userid: str):
    collection=db[userid]
    for results in collection.find({},{"_id":0,'keys':1}):
        print(results['keys'])

    # return {"keys": [
    #     {
    #         "uid": "Ai32Sdg",
    #         "provider": "Google",
    #         "account": "justdummy@gmail.com",
    #         "password": "U2FsdGVkX1/K4dkTdonH0WKA6ddlpoq+XgU5kIB/S8/5JIQ5FEZg1Mu/CD5+p02a",
    #         "color": 0
    #     },
    #     {
    #         "uid": "3AksgG3",
    #         "provider": "Facebook",
    #         "account": "rahuletto",
    #         "password": "U2FsdGVkX1/K4dkTdonH0WKA6ddlpoq+XgU5kIB/S8/5JIQ5FEZg1Mu/CD5+p02a",
    #         "color": 1
    #     },
    #     {
    #         "uid": "HsgaH4d",
    #         "provider": "Twitter",
    #         "account": "rahul",
    #         "password": "U2FsdGVkX1/K4dkTdonH0WKA6ddlpoq+XgU5kIB/S8/5JIQ5FEZg1Mu/CD5+p02a",
    #         "color": 3
    #     },
    #     {
    #         "uid": "MksyhWS",
    #         "provider": "Google",
    #         "account": "fakeaccount@gmail.com",
    #         "password": "U2FsdGVkX1/K4dkTdonH0WKA6ddlpoq+XgU5kIB/S8/5JIQ5FEZg1Mu/CD5+p02a",
    #         "color": 4
    #     },
    #     {
    #         "uid": "QgASgWg",
    #         "provider": "MongoDB",
    #         "account": "mongo-account",
    #         "password": "U2FsdGVkX1/K4dkTdonH0WKA6ddlpoq+XgU5kIB/S8/5JIQ5FEZg1Mu/CD5+p02a",
    #         "color": 2
    #     },
    #     {
    #         "uid": "GHdshes",
    #         "provider": "Reddit",
    #         "account": "redditman",
    #         "password": "U2FsdGVkX1/K4dkTdonH0WKA6ddlpoq+XgU5kIB/S8/5JIQ5FEZg1Mu/CD5+p02a",
    #         "color": 5
    #     },
    #     {
    #         "uid": "WgshWa",
    #         "provider": "SRMIST",
    #         "account": "srmman",
    #         "password": "U2FsdGVkX1/K4dkTdonH0WKA6ddlpoq+XgU5kIB/S8/5JIQ5FEZg1Mu/CD5+p02a",
    #         "color": 1
    #     }
    # ]}
    return {"keys": []}


@app.delete("/api/delete/{userid}/{uid}")
def delete_key(userid: str, uid: str):
    collection=db[userid]
    collection.update_one({},{'$pull':{'keys':{'uid':uid}}})

    # collection.delete_one({'userid':userid, 'uid': uid})
    return {"status": "success", "code": 1}


@app.patch("/api/edit/{userid}/{uid}")
def edit_key(userid: str, uid: str):
    return {"status": "success", "code": 1}
