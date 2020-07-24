const mongoose = require('mongoose');
mongoose.Promise  = require("bluebird");
const uri = "mongodb+srv://multichess:1883599682Mc@hertafeldcluster.k8hcs.gcp.mongodb.net/test?retryWrites=true&w=majority";
const  connection  =  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
module.exports  =  connection;