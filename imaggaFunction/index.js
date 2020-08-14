const {Storage} = require('@google-cloud/storage');
const MongoClient = require('mongodb').MongoClient;
const https = require('https');

exports.getImaggaData = (data, context) => {

    const dataLink = data.mediaLink;
    const mUri = process.env.MONGO_URI;
    let name = data.name;
    const dbName = 'final';
    const client = new MongoClient(mUri, { useUnifiedTopology: true });
    const auth = 'Basic ' + Buffer.from(process.env.API_KEY + ':' + process.env.API_SECRET).toString('base64');
    const userId = name.split('-', 1)[0];
    const imgName = name.split('-').pop();
    
    const storage = new Storage();
    const sourceBucket = storage.bucket(data.bucket);

    const options = {
        hostname: 'api.imagga.com',
        path: `/v2/colors?image_url=${encodeURIComponent(dataLink)}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': auth
        }
    }

    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', imgData => {
            const dataToString = imgData.toString('utf8');
            console.log(dataToString)
            
            client.connect(function(err) {
    
            // Set a pointer to the database that we named above
            const db = client.db(dbName);

            // Call the helper function that will insert a single document to the database
            insertDocument(db, dataToString, imgName, dataLink, userId, function(err, result){

                client.close();
                
                if(err) console.log(err);

                console.log(result);

                res.status(200).send();
            })
        });
        });
    });

    req.on('error', error => {
        console.error(error.toString('utf8'));
    });

    req.end();
}

insertDocument = (db, query, name, dataLink, userId, callback) => {

  // Set constant that holds the documents collection
  const collection = db.collection('imageData');
  const imgJson = JSON.parse(query);


  // Insert a document
  collection.insertOne({'imgName': name, 'imgLink': dataLink, 'email': userId, 'imgData': imgJson.result}, function(err, result){

    callback(err, result);
  });
};