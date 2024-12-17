//const fs = require('fs');
//const path = require('path');

//const DB_FILE = path.join(__dirname + '/files/data.txt');

const { MongoClient, ObjectId } = require('mongodb');

//Define Database URL
const dbURL = process.env.DB_URI || "mongodb://127.0.0.1";

//Define the database server
const dbClient = new MongoClient(dbURL);

var services = function (app) {

    app.post('/write-record', async function (req, res) {
        var monData = {
            dexNumber: req.body.dexNumber,
            name: req.body.name,
            type: req.body.type,
            availability: req.body.availability,
            obtain: req.body.obtain
        };

        var search = { dexNumber: req.body.dexNumber };


        try {
            const conn = await dbClient.connect();
            const db = conn.db("Gen4NatDex");
            const coll = db.collection("mons");

            const mon = await coll.find(search).toArray();

            if (mon.length > 0) {
                await conn.close();
                return res.send(JSON.stringify({ msg: "Pok&eacute;mon Already Exists" + error }));
            } else {
                await coll.insertOne(monData);
                await conn.close();
                return res.send(JSON.stringify({ msg: "SUCCESS" }));
            }

        } catch (error) {
            console.log("Error" + error);
            return res.send(JSON.stringify({ msg: "Error" + error }));
        }

    });

    app.get('/get-records', async function (req, res) {
        try {
            const conn = await dbClient.connect();
            const db = conn.db("Gen4NatDex");
            const coll = db.collection("mons");

            const data = await coll.find().toArray();

            await conn.close();

            return res.send(JSON.stringify({ msg: "SUCCESS", mons: data }));
        } catch (error) {
            //await conn.close();
            return res.send(JSON.stringify({ msg:"Error" + error }));
        }
    });

    app.get("/get-monsByType", async function (req, res) {
        var search = (req.query.type === "") ? {} : { type: req.query.type };

        try {
            const conn = await dbClient.connect();
            const db = conn.db("Gen4NatDex");
            const coll = db.collection("mons");

            const data = await coll.find(search).toArray();

            await conn.close();

            return res.send(JSON.stringify({ msg: "SUCCESS", mons: data }));
        } catch(error) {
            //await conn.close();
            return res.send(JSON.stringify({ msg:"Error" + error }));
        }

    });

    app.put('/update-mon', async function (req, res) {
        var updateData = {
            $set: {
                dexNumber: req.body.dexNumber,
                name: req.body.name,
                type: req.body.type,
                availability: req.body.availability,
                obtain: req.body.obtain
            }
        };

        try {
            const conn = await dbClient.connect();
            const db = conn.db("Gen4NatDex");
            const coll = db.collection("mons");
            
            const search = { _id: ObjectId.createFromHexString(req.body.ID) };
            
            await coll.updateOne(search, updateData);

            await conn.close();

            return res.send(JSON.stringify({ msg: "SUCCESS" }));
        } catch (err) {
            console.log(err);
            return res.send(JSON.stringify({ msg: "Error " + err }));
        }

    });
    app.delete("/delete-record", async function (req, res) {
        //console.log("Test")
        try {
            const conn = await dbClient.connect();
            const db = conn.db("Gen4NatDex");
            const coll = db.collection("mons");

            const search = {_id: ObjectId.createFromHexString(req.query.monID)};

            await coll.deleteOne(search);

            await conn.close();

            return res.send(JSON.stringify({msg: "SUCCESS"}));
        } catch (err) {
            console.log(err);
            return res.send(JSON.stringify({ msg: "Error" + err }));
        }
    });

    app.post('/refreshMons', async function (req, res) {
        // console.log("In refresh mons");
        try {
            const conn = await dbClient.connect();
            const db = conn.db("Gen4NatDex");
            const coll = db.collection('mons');
            await coll.drop();
            console.log("Dropped database");
            await client.close();
            initializeDatabase();
            return res.status(200).send(JSON.stringify({ msg: "SUCCESS" }));
        } catch (err) {
            console.log(err);
            return res.status(200).send(JSON.stringify({ msg: "Error: " + err }));
        }

    });
}

/* var initializeDatabase = async function () {

    try {
        const conn = await dbClient.connect();
        const db = conn.db("Gen4NatDex");
        const coll = db.collection('mons');
        const data = await coll.find().toArray();

        if (data.length === 0) {
            var mons = natDexMons.all;
            await coll.insertMany(mons);
            console.log("Added seed records");
        }

        await conn.close();
    } catch (err) {
        console.log(err);
    }

} */

        module.exports = services;