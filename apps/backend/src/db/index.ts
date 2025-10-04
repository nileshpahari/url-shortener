import mongoose from "mongoose";

const BASE_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
export const dbConnect = async () => {
    console.log(`${BASE_URI}/${DB_NAME}`)
  try {
    const db = await mongoose.connect(`${BASE_URI}/${DB_NAME}`);
    console.log("Connected to the db ", db.connection.host)
  } catch (error) {
    console.error("Error while connecting to the db\n", error);
    throw error;
  }
};
