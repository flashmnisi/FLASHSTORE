import express from "express";
import Dbcon from "./services/Database"
import App from "./services/ExpressApp"
import { PORT } from "./config";

const StartServer = async() => {

    const app = express();
    await Dbcon()
    await App(app)

    app.listen(PORT, ()=> {
        console.log(`Database connected from port ${PORT}`)
    })
}

StartServer();