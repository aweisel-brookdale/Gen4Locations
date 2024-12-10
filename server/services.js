const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname + '/files/data.txt');

const { MongoClient, ObjectID } = require('mongodb');

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

        //var search = { dexNumber: req.body.dexNumber };
        //var dexData = [];


        try {
            const conn = await dbClient.connect();
            const db = conn.db("Gen4NatDex");
            const coll = db.collection("mons");

            //const mon = await coll.find(search).toArray();

            /* if (mon.length > 0) {
                await conn.close();
                return res.send(JSON.stringify({ msg: "Pok&eacute;mon Already Exists" + error }));
            } else { */
                await coll.insertOne(monData);
                await conn.close();
                return res.send(JSON.stringify({ msg: "SUCCESS" }));
            //}

        } catch (error) {
            console.log("Error" + error);
            return res.send(JSON.stringify({ msg: "Error" + error }));
        }

    });

    app.get("/get-records", async function (req, res) {
        try {
            const conn = await dbClient.connect();
            const db = conn.db("Gen4NatDex");
            const coll = db.collection("mons");

            const data = await coll.find().toArray();

            await conn.close();

            return res.send(JSON.stringify({ msg: "SUCCESS", mons: data }));
        } catch (error) {
            await conn.close();
            return res.send(JSON.stringify({ msg: "Error" + error }));
        }
    });

    app.get("/get-monsByName", async function (req, res) {
        var search = (req.query.name === "") ? {} : { type: req.query.name };

        try {
            const conn = await dbClient.connect();
            const db = conn.db("Gen4NatDex");
            const coll = db.collection("mons");

            const data = await coll.find(search).toArray();

            await conn.close();

            return res.send(JSON.stringify({ msg: "SUCCESS", mons: data }));
        } catch (error) {
            await conn.close();
            return res.send(JSON.stringify({ msg: "Error" + error }));
        }

    });
    app.delete("/delete-record", function (req, res) {
        //console.log("Test")
        var id = req.body.deleteID;
        if (fs.existsSync(DB_FILE)) {
            fs.readFile(DB_FILE, "utf8", function (err, data) {
                if (err) {
                    res.send(JSON.stringify({ msg: err }));
                } else {
                    var dexData = JSON.parse(data);
                    for (var i = 0; i < dexData.length; i++) {
                        if (dexData[i].id == id) {
                            dexData.splice(i, 1);
                            break;
                        }
                    }
                    fs.writeFile(DB_FILE, JSON.stringify(dexData), function (err) {
                        if (err) {
                            res.send(JSON.stringify({ msg: err }));
                        } else {
                            res.send(JSON.stringify({ msg: "SUCCESS" }));
                        }
                    })
                }
            });
        } else {
            res.send(JSON.stringify({ msg: "File does not exist" }));
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