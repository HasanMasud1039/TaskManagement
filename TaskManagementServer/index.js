const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require("jsonwebtoken");
require('dotenv').config();

const port = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors());

//mongodb connection
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fznkpfd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

//JSON Web Token
const verifyJWT = (req, res, next) => {
    const authentication = req.headers.authentication;
    if (!authentication) {
      return res
        .status(401)
        .send({ error: true, message: "unauthorized access" });
    }
  
    const token = authentication.split(" ")[1];
  
    // verify a token symmetric
    jwt.verify(token, process.env.ACCESS_TOKEN_JWT, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .send({ error: true, message: "unauthorized access" });
      }
  
      req.decoded = decoded;
      next();
    });
  };

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        //add DB
        const usersCollection = client
            .db("TaskManagementDB")
            .collection("Users");
        const tasksCollection = client
            .db("TaskManagementDB")
            .collection("Tasks");
        // const loggedUserCollection = client
        //     .db("TaskManagementDB")
        //     .collection("LoggedUser");

        //JWT Authentication
        app.post("/jwt", (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_JWT, {
              expiresIn: "1h",
            });
            res.send({ token });
          });

        //handle user
        //send user data to DB
        app.post("/users", async (req, res) => {
            const user = req.body;

            const query = { email: user.email };

            const existingUser = await usersCollection.findOne(query);
            if (existingUser) {
                return res.send({
                    message: ` ${user.name} already exists in the Task Management database`,
                });
            }

            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        //show user data
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        //handle loggedUser
        //send loggedUser data to DB
        app.get("/loggedUser", async (req, res) => {
            const loggedUser = req.body;

            const query = { email: loggedUser.email, password: loggedUser.password };

            const isUser = await usersCollection.findOne(query);
            if (isUser) {
                console.log("user is ok.", isUser);
                return res.send({ isUser,
                    message: ` ${isUser.name} exists in the Task Management database`,
                });
            }
            else{
                console.log("user is not ok.", loggedUser);
                return res.send({
                    message: ` ${isUser.name} does not exist in the Task Management database`,
                });
            }

            
        });
        //show loggedUser data
        // app.get('/loggedUser', async (req, res) => {
        //     const loggedUser = req.body;
        //     const cursor = loggedUserCollection.find();
        //     const result = await cursor.toArray();
        //     res.send(result);
        // })
                //delete loggedUser data
                app.delete('/loggedUser/:email', async (req, res) => {
                    const loggedUser = req.params.email;
                    
                    const query = { email: loggedUser };
                    const result = await loggedUserCollection.deleteOne(query);
                    res.send(result);
                    console.log("deleted result ", result);
                })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }

}

//connection established
run().catch(console.dir);

app.get("/", async (req, res) => {
    res.send("Welcome to the Task Management server side!");
});

app.listen(port, (req, res) => {
    console.log(`Task Management server listening on port ${port}`);
});