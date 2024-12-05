const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname + '/files/data.txt');

var services = function(app) {
    app.post('/write-record', function(req, res) {
        var id = "lib" + Date.now();

        var monData = {
            id: id,
            dexNumber: req.body.dexNumber,
            name: req.body.name,
            type: req.body.type,
            availability: req.body.availability,
            obtain: req.body.obtain
        };

        console.log(JSON.stringify(monData));
        var dexData = [];

        if(fs.existsSync(DB_FILE)) {
            //Read in current database
            fs.readFile(DB_FILE, "utf8", function(err, data) {
                if(err) {
                    res.send(JSON.stringify({msg: err}));
                } else {
                    dexData = JSON.parse(data);

                    dexData.push(monData);

                    fs.writeFile(DB_FILE, JSON.stringify(dexData), function(err) {
                        if(err) {
                            res.send(JSON.stringify({msg: err}));
                        } else {
                            res.send(JSON.stringify({msg: "SUCCESS"}));
                        }
                    })
                }
            });
        } else {
            dexData.push(monData);
            console.log(JSON.stringify(dexData));
            console.log(DB_FILE);

            fs.writeFile(DB_FILE, JSON.stringify(dexData), function(err) {
                if(err) {
                    res.send(JSON.stringify({msg: err}));
                } else {
                    res.send(JSON.stringify({msg: "SUCCESS"}));
                }
            });
        }

    });

    app.get("/get-records", function (req, res) {
        console.log("Test")
        if (fs.existsSync(DB_FILE)) {
            fs.readFile(DB_FILE, "utf8", function (err, data) {
                if (err) {
                    res.send(JSON.stringify({ msg: err }));
                } else {
                    var dexData = JSON.parse(data);
                    res.send(JSON.stringify({ msg: "SUCCESS", fileData: dexData }));
                }
            });
        } else {
            data = [];
            res.send(JSON.stringify({ msg: "SUCCESS", fileData: data }));
        }
    });


};

module.exports = services;