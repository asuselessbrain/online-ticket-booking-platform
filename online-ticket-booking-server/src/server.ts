import mongoose from "mongoose";
import app from "./app";
import { config } from "./config";

const server = async () => {
    try{
        await mongoose.connect(`${config.dbUrl}`);
    }
    catch(error){
        console.log("Database connection failed");
    }
}

server();

app.listen(`${config.port}`, () => {
    console.log(`Server is running on port ${config.port}`);
})