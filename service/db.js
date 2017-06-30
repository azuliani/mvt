var Datastore = require("nedb");
var AsyncLock = require("async-lock");

db = new Datastore({filename: "dbdata", autoload: true});
db.persistence.setAutocompactionInterval(10000);

db2 = new Datastore({filename: "pushes", autoload: true});
db2.persistence.setAutocompactionInterval(10000);

function init(cb){
    db.update({_id: 'totalpushes'}, {$set: {value: 0}}, {upsert: true}, function (err, res) {
        console.log("Init result:", err, res);
    });
}

function storeTst(pushes){
    db2.insert({tst: new Date(), p: pushes}, function (err, res) { })
}

function getTotalPushes(cb){
    db.findOne({_id: 'totalpushes'}, function (err, res){
        if (err) throw err;
        cb(null, res.value);
    });
}

var incrementLock = new AsyncLock();
function incrementPushes(cb){
    incrementLock.acquire('increment', function (releaseLock){
        db.update({_id: 'totalpushes'}, {$inc: {value:1}}, function(err, res){
            if (err) throw err;
            releaseLock();
            getTotalPushes(cb);
        });    
    });
}

module.exports = {
    init,
    getTotalPushes,
    incrementPushes,
    storeTst
}
