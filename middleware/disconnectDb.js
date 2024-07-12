const mongoose = require('mongoose');
// import dotenv from 'dote '


const url = process.env.MONGO_URI
const disconnectDB = async () => {
    await mongoose.disconnect(url)

        .then(async () => {
            console.log('disconnected to mongo')
        })

        .catch((err) => {
            console.error('failed to disconnected with mongo');
            console.error(err);
        });
};

module.exports = disconnectDB;