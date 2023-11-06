import os

from pymongo import MongoClient
from fastapi import FastAPI, Request
from pydantic import BaseModel

app = FastAPI()

cluster=MongoClient(os.environ["MONGO"])
db=cluster['passket']

class Password(BaseModel):
    uid: int
    provider: str
    account: str
    password: str
    color: int #Color


@app.get("/api/ping")
def ping():
    return {"message": "Pong"}  # Always return as Dictionary (JSON)


@app.post("/api/create/{userid}")
async def add_key(userid: str, item: Request): 
    data = await item.json()
    print(data)

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

    
    dt = {"keys": []}
    
    for data in collection.find({"userid": userid}):
        dt = { "userid": data['userid'], "keys": data['keys']}

    #post={provider:data['provider'],account:data['account'],password:data['password'],color:data['color']}
    #collection.insert_one(post)
    
    return {"userid": userid, "data": dt, "status": "success", "code": 1}


@app.get("/api/fetch/{userid}")
def fetch_key(userid: str):
     
    if(userid == "undefined"): return {"status": "fail", "code": 0}
    collection=db[userid]
    dt = {"keys": []}
    
    for data in collection.find({"userid": userid}):
        dt = { "userid": data['userid'], "keys": data['keys']}
        
    return {"keys": dt['keys']}


@app.delete("/api/delete/{userid}/{uid}")
def delete_key(userid: str, uid: str):
    collection=db[userid]
    collection.update_one({},{'$pull':{'keys':{'uid':uid}}})

    return {"status": "success", "code": 1}
