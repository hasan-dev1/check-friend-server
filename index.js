const express = require('express');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
const fakedata = require('./fakedata/fakedata.json')
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


const uri =
  "mongodb+srv://randomaccess:randomaccess@cluster0.v48zzim.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const serviceFakeData = client.db("checkFriend").collection("serviceFakeData");
const serviceHomeData = client.db("checkFriend").collection("serviceHomeData");
const selecteditem = client.db("checkFriend").collection("slectionItem");
const ownerItem = client.db("checkFriend").collection("ownerItem");



app.use(cors())
app.use(express.json())

async function run(){
  try{
    app.get('/',(req,res)=>{
    res.send('Your server is running....')
})
app.get('/service',async(req, res)=>{
    const result = await serviceHomeData.find({}).toArray();
    res.send(result)
})
app.get('/service/:id', (req, res)=>{
    const query = parseInt(req.params.id);
    const rest = fakedata.filter(item => item.id === query)
    res.send(rest)
})
app.get("/fakedata/friendcheck",async(req, res) => {
  const result = await serviceFakeData.find({}).toArray()
  res.send(result)
});
app.get('/saved/ownerItem',async(req, res)=>{
  const query = {}
  const result = await ownerItem.find(query).toArray()
  res.send(result)
})
app.get('/saved/ownerItem/single',async(req, res)=>{
  const id = req.query.id;
  const query = {_id:ObjectId(id)}
  const result = await ownerItem.findOne(query)
  res.send(result)
})
app.get("/service/showService/:id",async(req, res)=>{
  const id = req.params.id;
  const query = {_id:ObjectId(id)}
  const result = await ownerItem.findOne(query)
  res.send(result)
});
app.get('/selectionitem',async(req, res)=>{
  const query = {}
  const result = await selecteditem.find(query).toArray()
  res.send(result)
})

// post 
app.post('/save/owneritem',async(req, res)=>{
  const item = req.body;
  const result = await ownerItem.insertOne(item);
  res.send(result)
  
})

// put/update 
app.put('/saved/ownerItem',async(req, res)=>{
  const id = req.query.id;
  const selecteditem = req.body;
  const query = {_id:ObjectId(id)}
  const option = {upsert:true}
  const updateDoc = {$push:{result:selecteditem}}
  const result = await ownerItem.updateOne(query,updateDoc,option)
  res.send(result)
})

//delete
app.delete("/saved/ownerItem/single", async (req, res) => {
  const id = req.query.id;
  const query = { _id: ObjectId(id) };
  const result = await ownerItem.deleteOne(query);
  res.send(result);
});
  }finally{

  }
}
run().catch(err => console.log(err.message))
app.listen(port,()=>{
    console.log('your server running on', port)
})
