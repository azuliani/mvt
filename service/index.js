"use strict";

var express = require("express")
var EventEmitter = require("events").EventEmitter;

var db = require("./db");

var app = express()
var expressWs = require('express-ws')(app);

var updateEmitter = new EventEmitter();

app.use("/static", express.static('static'))

app.get('/now', (req, res) => {
    db.getTotalPushes(function (err, totalpushes) {  
        res.json({totalpushes})
    });
})

app.get("/push", (req, res) => {
    db.incrementPushes(function (err, totalpushes) {
        res.json({ok: true, totalpushes});
        updateEmitter.emit('pushes', totalpushes);
    });
});

app.ws("/pushupdates", function(ws, req) {
    ws.on('message', function(msg){
        db.getTotalPushes(function (err, totalpushes) {  
            ws.send(JSON.stringify({totalpushes}))
        });
    });
    function onPush(totalpushes){
        ws.send(JSON.stringify({totalpushes}));
    };
    var pingInterval = setInterval(function () {
        ws.send(JSON.stringify({ping: true}));
    },1000);
    updateEmitter.on('pushes', onPush);
    ws.on('close', () => { 
        updateEmitter.removeListener('pushes', onPush) 
        clearInterval(pingInterval);
    })
});

var PORT = 3000
app.listen(PORT, () => {
  console.log('Service listening on port', PORT)
})
