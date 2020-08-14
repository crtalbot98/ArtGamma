const mongoClient = require('mongodb').MongoClient;

class MongoConnection {

    constructor() {
        const mongo_url = process.env.MONGO_CONNECTION_STRING;
        this.client = new mongoClient(mongo_url, { useUnifiedTopology: true });
    }

    async init(){

        await this.client.connect();

        const dbName = 'final';

        this.db = this.client.db(dbName);
    }
}

module.exports = new MongoConnection();