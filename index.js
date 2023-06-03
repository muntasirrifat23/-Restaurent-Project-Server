const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://restaurantBoss:9rdOvl52GaEKqbYI@cluster0.isaiemh.mongodb.net/?retryWrites=true&w=majority";
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.isaiemh.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const menuCollection = client.db("bistroDb").collection("menu");

    const cartCollection = client.db("bistroDb").collection("cart");

    const userCollection = client.db("bistroDb").collection("users");

    app.get('/menu', async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result)
    })

    // Users
    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result)
    })

    // Cart Collection
    // Cart Get
    app.get('/cart', async(req,res)=>{
      const email= req.query.email;
      console.log(email);
      if(!email){
        res.send([]);
      }
      const query={email: email};
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    })
    // Cart Post
    app.post('/cart', async (req, res) => {
      const salad = req.body;
      // console.log(salad);
      const result = await cartCollection.insertOne(salad);
      res.send(result)
    })
    // Cart delete
    app.delete('/cart/:id', async(req,res)=>{
      const id= req.params.id;
      const query= {_id: new ObjectId(id)};
      const result= await cartCollection.deleteOne(query);
      res.send(result);
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Muntasir')
})

app.listen(port, () => {
  console.log(`on port ${port}`)
})