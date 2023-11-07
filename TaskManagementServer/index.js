const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const port = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


//mongodb connection
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

        //JWT Authentication
        app.post("/jwt", (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_JWT, {
                expiresIn: "1h",
            });
            res.send({ token });
            console.log(token)
        });

        //handle user
        //send user data to DB
        app.post("/users", async (req, res) => {
            const user = req.body;
            const query = { email: user.email };
            const { email, password, name, photoURL } = user;
            const hashedPassword = await bcrypt.hash(password, 10);
            const registeredUser = { name, email, hashedPassword, photoURL };
            const existingUser = await usersCollection.findOne(query);
            if (existingUser) {
                return res.send({
                    message: ` ${user.name} already exists in the Task Management database`,
                });
            }
            const result = await usersCollection.insertOne(registeredUser);
            res.send(result);
        });

        //show user data
        app.get('/users', verifyJWT, async (req, res) => {
            const cursor = usersCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        //show specific user data
        app.get('/users/:email', verifyJWT, async (req, res) => {
            const userEmail = req.params.email;
            const query = { email: userEmail };
            const result = await usersCollection.find(query).toArray();
            const { _id, name, email, photoURL } = result[0];
            const user = { name, email, photoURL, _id }
            res.send(user);
        })

        // Login
        app.post('/login', async (req, res) => {
            const { email, password } = req.body;
            const user = await usersCollection.findOne({ email });
            console.log(user);
            if (!user) {
                return res.status(400).json('User not found');
            }
            const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
            console.log(passwordMatch)

            if (!passwordMatch) {
                return res.status(400).json('Invalid password');
            }
            const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_JWT, { expiresIn: '1h' });
            res.json({ token });
        });

        //send task data to DB
        app.post("/tasks", async (req, res) => {
            const task = req.body;
            const result = await tasksCollection.insertOne(task);
            res.send(result);
        });

        //Show task data
        app.get('/tasks', verifyJWT, async (req, res) => {
            const user = req.body;
            const result = await tasksCollection.find().toArray();
            res.send(result);
        })

        //Show task data :: email
        app.get('/tasks/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email };
            const result = await tasksCollection.find(query).toArray();
            res.send(result);
        })

        //delete task
        app.delete("/tasks/:id", async (req, res) => {
            const taskId = req.params.id;
            const query = { _id: new ObjectId(taskId) };
            console.log("deleted query id ", query.taskId);
            const result = await tasksCollection.deleteOne(query);
            res.send(result);
            console.log("deleted result ", result);
        });

        // handleUpdate
        app.patch("/tasks", async (req, res) => {
            const id = req.body.id; // Access id from req.body
            const updatedTask = req.body.updatedTask; // Access data from req.body
            console.log(updatedTask);
            const query = { _id: new ObjectId(id) };
            const update = {
                $set: {
                    task: updatedTask.task,
                    date: updatedTask.date,
                    time: updatedTask.time,
                    description: updatedTask?.description,
                }
            };
            const options = { upsert: true };
            const result = await tasksCollection.updateOne(
                query,
                //   options,
                update
            );
            // Retrieve the updated document after the update
            const updatedDocument = await tasksCollection.findOne(query);
            res.send({ result, updatedDocument });
        });

        //search
        app.get("/getSearchByTaskName/:text", async (req, res) => {
            const searchText = req.params.text;
            const result = await tasksCollection
                .find({
                    name: { $regex: searchText, $options: "i" },
                })
                .toArray();
            res.send(result);
        });

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