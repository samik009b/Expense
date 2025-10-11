import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    const mongo_url = config.mongo_url as string;
    const connectionInstanceOf = await mongoose.connect(mongo_url);
    console.log("database connected, ", connectionInstanceOf.connection.host);
  } catch (error) {
    console.log("connection failed", error);
    process.exit(1);
  }
};
export default connectDB;
