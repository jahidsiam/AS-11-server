const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const port = process.env.PORT ||5000


app.use(cors(
));

app.use(express.json())


app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })


  const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dr9an2m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  


  
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
    //   await client.connect();
      // Send a ping to confirm a successful connection
      const assignmentCollection = client.db("assignmentDB").collection("assignment");
      
      const submittedCollection = client.db("assignmentDB").collection("submitted");

    

      app.post('/submitted',async(req,res)=>{
        const submitted = req.body;
        console.log(submitted)
        const result = await submittedCollection.insertOne(submitted);
        res.send(result)
    })
      

      app.get('/assignment',async(req,res)=>{
        const cursor = assignmentCollection.find()
        const result = await cursor.toArray()
        res.send(result)
      })

      app.post('/assignment',async(req,res)=>{
        const assignment = req.body;
        console.log(assignment)
        const result = await assignmentCollection.insertOne(assignment);
        res.send(result)
    })
    

      app.get('/assignment/:id',async(req,res)=>{
        const id = req.params.id
        const query = { _id: new ObjectId(id) };
        const user = await assignmentCollection.findOne(query);
        res.send(user)
      })
      app.get('/pending-assignment/:status',async(req,res)=>{
        const status = req.params.status;
        const user = await submittedCollection.find({ status: status }).toArray();
        console.log(user)
        res.send(user)
       
      })
     
    
     

      app.get('/my-assignment/:email',async(req,res)=>{
        console.log(req.params.email)
        const result = await submittedCollection.find({email: req.params.email}).toArray()
        res.send(result)
      })



      app.put('/my-assignment/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updatedBooking = req.body;
        console.log(updatedBooking);
        const updateDoc = {
            $set: {
                status: updatedBooking.status,
                pdf: updatedBooking.pdf,
                notes: updatedBooking.notes
            },
        };
        const result = await assignmentCollection.updateOne(filter, updateDoc,options);
        res.send(result);
    })


      
     
      
      app.put('/assignment/:id',async(req,res)=>{
        const id = req.params.id
        const assignment = req.body;
        console.log(id,assignment)
        const filter = {_id: new ObjectId(id)};
        const options = { upsert: true };
        const updateUser = {
          $set: {
            title: assignment.title,
            thumbnail_image_url: assignment.thumbnail_image_url,
            marks: assignment.marks,
            description: assignment.description,
            difficulty_level: assignment.difficulty_level,
            due_date: assignment.due_date,
            
          },
        };
        const result = await assignmentCollection.updateOne(filter, updateUser, options);
          res.send(result)
      })

      
    
      app.delete('/delete/:id',async(req,res)=>{
        const id = req.params.id
        console.log('delete',id)
        const query = { _id: new ObjectId(id) };
        const result = await assignmentCollection.deleteOne(query);
        res.send(result)
      })
    
  
      
  


      // await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);
  