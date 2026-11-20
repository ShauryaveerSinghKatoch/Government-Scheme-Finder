// noinspection ES6ConvertVarToLetConst

import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if(!MONGODB_URI) {
    throw new Error("MongoDB URI is missing")
}

interface MongooseCache  {
    conn : typeof mongoose | null;
    promise :  Promise< typeof mongoose> | null;
}

declare global {
    var mongoose : MongooseCache | undefined;
}

const cached =
    global.mongoose ??
    (global.mongoose = {
        conn: null,
        promise: null,
    });

async function connectDB(): Promise<typeof mongoose> {
    if(cached.conn) {
        return cached.conn;
    }
    if(!cached.promise){
        // @ts-ignore
        cached.promise = mongoose.connect(MONGODB_URI).then( (mongoose) => {
            return mongoose;
        });
    }
    try{
        cached.conn = await cached.promise;
    }catch(e){
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}
export default connectDB;