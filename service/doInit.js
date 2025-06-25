var db = require("./db");

db.init();

setTimeout(()=>{process.exit(0)},1000);
