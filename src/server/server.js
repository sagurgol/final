import express from "express";
import ViteExpress from "vite-express";
import {
  MongoClient,
  ServerApiVersion,
  ObjectId
} from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.static('dist'))
app.use(express.json())

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient(uri);

let collection = null;
let collection2 = null;
let reqID;
let currentUser;

async function run() {
  await client.connect();
  collection = await client.db("FinalData").collection("FinalData");
  collection2 = await client.db("FinalData").collection("Invites");
}

run();


//Checking DB for correct login
app.post("/login", async (req, res) => {
  const username = req.body.username; 
  const password = req.body.password;
  const doc = await collection.findOne({
    $and: [{ user: { $eq: username } }, { pass: { $eq: password } }],
  });
  console.log(doc);

  if (doc !== null) {
    reqID = doc._id; //save the database ID of the logged-in user
    currentUser = username; //save current username (for invite)
    //req.session.login = true;
    res.json({"message":"login found"}) 
  } else {
    res.json({"message":"wrong"})
  };
})

app.post("/create", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const find = await collection.findOne({user: username})
  if (find !== null) {
    res.json({"message":"username already used"})
  } else {
    const doc = await collection.insertOne(
      {user: username, pass: password, eventCount: 0}
    )
    res.json({"message": "created"})
    console.log(doc);
  }
});

app.post('/add', async (req,res)=>{
  const name = req.body.name;
  const date = req.body.date;
  const start = req.body.start;
  const end = req.body.end;
  const doc = await collection.findOne({_id: reqID}, {eventCount: 1});
  const events = Object.keys(doc).filter(key=>key.startsWith("Event")).map(key => doc[key]);
  const titles = events.map(event => {
  if (Array.isArray(event) && event.length > 0) {
    return event[0];
  }
}).filter(title => title !== null);
  if(titles.includes(name)){
   res.json({"message":"Event name already used"}) 
  }else{
  let count = doc.eventCount;
  let eventID = `Event ${count}`;
  await collection.updateOne(
    {_id: reqID},
    {$set: {[eventID]: [name, date, start, end]},
    $inc : {eventCount: 1}}
  )
  res.json({"message":"updated"})
  }
});

app.post('/delete', async (req,res)=>{
  console.log(req.body)
  const name = req.body.name;
  const doc = await collection.findOne({_id: reqID});
  const eventKeys = Object.keys(doc).filter(key => key.startsWith("Event"));
  const eventID = eventKeys.find(key => doc[key][0] === name);
  const deleted = await collection.updateOne(
      {_id: reqID},
      {$unset: {[eventID]: 1}}
      )
  res.json({"message": "deleted"})
});

app.get('/getCal', async(req,res)=>{
  const cal = await collection.findOne({_id: reqID})
  const events = Object.keys(cal).filter(key=>key.startsWith("Event")).map(key => cal[key]);
  res.json(events)
})

app.post("/invite", async (req, res) => {
  const creator = currentUser;
  const invitee = req.body.invited;
  const name = req.body.name;
  const date = req.body.date;
  const start = req.body.start;
  const end = req.body.end;
  if (creator === invitee) {
    console.log("cant invite yourself");
    res.json({"message": "no"})
  } else {
    const find = await collection2.findOne({
      creator: creator, 
      invitee: invitee,
      name: name,
      date: date,
      start: start,
      end: end
    })
    if (find !== null) {
      console.log("invitation already exists");
      res.json({"message": "dejavu"})
    } else {
      const doc = await collection2.insertOne({
        creator: creator, 
        invitee: invitee,
        name: name,
        date: date,
        start: start,
        end: end
      })
      console.log(doc);
      res.json({"message": "invited"})
    }
  } 
});

app.get('/getInv', async(req,res)=>{
  console.log(currentUser)
  const inv = await collection2.find({invitee: {$eq: currentUser}}).toArray();
  console.log(inv)
  res.json(inv)
})


app.post('/deleteInv', async(req, res) => {
  const creator = req.body.creator;
  const name = req.body.name;
  const date = req.body.date;
  const start = req.body.start;
  const end = req.body.end;
  const invitee = currentUser;
  
  const deleted = await collection2.deleteOne(
    {creator: creator, invitee: invitee, name: name, date: date, start: start, end: end}
  );
  console.log(deleted);
  res.json({"message": "deleted"})
})

ViteExpress.listen(app, 3000, () => {
  console.log("Server is running")
})