"use strict";

var Datastore = require("nedb");

var db = new Datastore({filename: "pushes"});
db.loadDatabase()
db.find({}, (err, docs) => {
    for(let doc of docs){
        console.log([doc.tst.getTime(), doc.p].join('\t'));
    }
});
