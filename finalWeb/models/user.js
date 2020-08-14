const dbService = require('../mongoConn.js');
const connection = require('../db');
const bcrypt = require('bcrypt');

class User {

    constructor(userData) {

        this.givenName = userData.name.givenName,
        this.familyName = userData.name.familyName,
        this.email = userData.emails[0].value
    }

    static async addUser(userData, type, done) {

        let newUser;
        
        if(type === 'google'){
            newUser = await connection.query(`INSERT INTO signup (first_name, last_name, email, password, user_id)
                VALUES ("${userData.name.givenName}", "${userData.name.familyName}", "${userData.email}", "null", "${userData.user_id}")`,
                function(error, results, fields){
                    if(error) throw error;
                    return results;
            });
        }
        else{
            newUser = await connection.query(`INSERT INTO signup (first_name, last_name, email, password, user_id)
                VALUES ("${userData.first_name}", "${userData.last_name}", "${userData.email}", "${userData.password}", "null")`,
                function(error, results, fields){
                    if(error) throw error;
                    console.log('in add user');
                    console.log(userData);
                    return done(null, [userData]);
            });
        }


        // const newUser = await dbService.db.collection('users').insertOne(userData);

        return newUser;
    }

    static async checkPassword(email, password, callback){
        
        let hash = await connection.query(`SELECT * FROM signup WHERE email = "${email}"`,
            function(error, results, fields){
                if(error) throw error;

                bcrypt.compare(password, results[0].password, function(err, isMatch) {
                    if (err){
                        callback(error, null, null);
                    } 
                    else if(!isMatch){
                        callback(null, true, results);
                    } 
                    else{
                        callback(null, false, results);
                    }
                })
                return results;
        });
    }

    static async checkUserExists(userData, type, callback) {

        // const result = await dbService.db.collection('users').find({id: userID}).toArray();

        let result;

        if(type === 'google'){
             result = await connection.query(`SELECT * FROM signup WHERE user_id = ${userData.user_id}`,
                function(error, results, fields){
                    if (error) {
                        callback(error, null);
                    }
                    else{
                        callback(null, results);
                    }
            });

            return result;
        }
        else{
            result = await connection.query(`SELECT * FROM signup WHERE email = "${userData.email}"`,
                function(error, results, fields){
                    if (error) {
                        callback(error,null);
                    }
                    else{
                        callback(null,results);
                    }
            });

            return result;
        }

    }
}

module.exports = User;