import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
    if (cached.conn) {
        // console.log("cached connect to mongoDB")
        return cached.conn;
    }

    if (!cached.promise) {
        // console.log(" not cached promise in mongoDB")

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
            return mongoose;
        });
    }

    cached.conn = await cached.promise;
    console.log("connected to mongoDB")

    return cached.conn;
}

const db = {
    connect,
    mongoose,
};

export default db;
