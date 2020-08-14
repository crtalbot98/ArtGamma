const dbService = require('../mongoConn');
const ObjectId = require('mongodb').ObjectId; 

exports.getDrawings = async () => {

    const drawingList = await dbService.db.collection('imageData').find().toArray();

    return drawingList;
}

exports.getUserDrawings = async (email) => {

    // const key = new ObjectId(id);

    const userList = await dbService.db.collection('imageData').find({email: email}).toArray();

    return userList;
}

exports.getUserName = async (id) => {

    const user = await dbService.db.collection('users').find({id: id}).toArray();

    return user;
}