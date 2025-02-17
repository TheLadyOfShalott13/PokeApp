/**
 * ===========importing packages==============
 */
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import sequelize from "./config/conn.js";
import cookieParser from "cookie-parser";
import cors from "cors"
//import './cron.js';

/**
 * ===========importing routes==============
 */
import userRoute from "./routes/user.js";
import favoritesRoute from "./routes/favorites.js";
import pokemonRoute from "./routes/pokemon.js";
import poketypeRoute from "./routes/poketype.js";
import pokevolutionRoute from "./routes/pokevolution.js";


/**
 * ============initializing express app DB syncing===============
 */
const app = express();

app.use("/uploads", express.static("uploads"));
dotenv.config({path:"./config/.env"});

sequelize.sync(
//    { alter: true }   //uncomment when syncing model changes
).then(() => { console.log('user table created successfully!'); })
    .catch((error) => { console.error('Unable to create table : ', error); });

app.get('/', (req, res) => { res.send('Hello from Express!') });


/**
 * ============Adding the middlewares==============
 */
app.use(cookieParser())
app.use(express.json());
app.use(helmet());
app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true
}))
app.use(morgan("common"));


/**
 * ==============allow app to use imported routes here==============
 */
app.use("/api/user", userRoute);
app.use("/api/favorites", favoritesRoute);
app.use("/api/pokemon", pokemonRoute);
app.use("/api/poketype", poketypeRoute);
app.use("/api/pokevolution", pokevolutionRoute);

app.listen(process.env.APP_PORT, () => { console.log("Listening on port " + process.env.APP_PORT); });
