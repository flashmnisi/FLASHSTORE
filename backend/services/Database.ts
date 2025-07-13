import mongoose from "mongoose"
import { MONGO_URI } from "../config"

export default async() => {

    try {
        if (!MONGO_URI) {
            throw new Error('Missing MONGO_URI in .env');
          }
          
        await mongoose.connect(MONGO_URI)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}