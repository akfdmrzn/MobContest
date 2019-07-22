/* 
    *Module Dependencies
*/

const config = require('./config');
const mongoose = require('mongoose');
const restify =  require('restify');
const restifyPlugins =  require('restify-plugins');

/*
    *initialize Server 
*/

const server = restify.createServer({
    name: config.name,
    version: config.version,
});

/*
    *MiddleWare
*/



server.use(restifyPlugins.jsonBodyParser({mapParams:true}));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({mapParams:true}));
server.use(restifyPlugins.fullResponse());

/*
    * Start Server, Connect to DB & Require Routes
]*/

server.listen(config.port,()=>{
    //Establish connection to mongodb
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db.uri,{useMongoClient:true});

    const db = mongoose.connection;

    db.on('error',(error)=>{
        console.log(error);
        process.exit(1);
    });

    db.once('open',()=>{
        require('./routes')(server);
        console.log(`Server is listening on port ${config.port}`);
    });

});