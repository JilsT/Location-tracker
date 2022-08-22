const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const response = require("express");
const Datastore = require('nedb');
const { timeStamp } = require("console");
const NodeGeocoder = require('node-geocoder');
const env = require('env');


const app = express();
const databaseFile = new Datastore("databaseFile.db");

databaseFile.loadDatabase();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit : "1mb" }));

app.get("/",function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.get("/api", function(req, res){
    databaseFile.find({}, function(err, data){
        if(err){
            res.end();
            return;
        }
        res.json(data);
    })
});


app.post("/api", function(req, res){
    console.log(req.body);
    console.log("request received");
    const data = req.body;
    const time = Date.now();
    const mood = data.mood;
    data.time = time;
    databaseFile.insert(data);
    res.json({
        status : "success",
        latitude : data.lat,
        longitude : data.lon,
        time : time,
        mood : mood,
    });
});

const port = process.env.PORT || 3000;

app.listen(port, function(req, res){
    console.log(`Server is  running on ${port} `);
});



