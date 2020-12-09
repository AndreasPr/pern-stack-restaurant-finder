require("dotenv").config();
const cors = require("cors");
const express = require("express");
const db = require("./db");
const morgan = require("morgan");
const app = express();

app.use(cors());
app.use(express.json()); //Take the JSON sent by the client and convert it to a standard JavaScript Object.

//Middleware Morgan
// app.use(morgan("dev"));
//OR use:
//The placement of the middleware is important and it should be on the top!!! Express reads from the top to down.
//My Middleware
// app.use((req, res, next) => {
//     console.log("Middleware");
//     next();
// });

//Get all restaurants
app.get("/api/v1/restaurants", async (req, res)=>{
    try{
        const results = await db.query("select * from restaurants;");
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                restaurants: results.rows
            }
        });
    }catch(err){
        console.log(err);
    }
});

//Get a restaurant
app.get("/api/v1/restaurants/:id", async (req,res)=>{
    try{
        const results = await db.query("select * from restaurants where id = $1", [req.params.id]);
        res.status(200).json({
            status: "success",
            data: {
                restaurant: results.rows[0]
            }
        });
    }catch(err){
        console.log(err);
    }
});

//Create a restaurant
app.post("/api/v1/restaurants", async (req, res) => {
    try{
        const results = await db.query("INSERT INTO restaurants (name, location, price_range) VALUES ($1, $2, $3) returning *", 
        [req.body.name, req.body.location, req.body.price_range]);
        res.status(201).json({
            status: "success",
            data: {
                restaurant: results.rows[0]
            }
        });
    }
    catch(err){
        console.log(err);
    }
});

//Update restaurant
app.put("/api/v1/restaurants/:id", async (req, res) => {
    console.log(req.params.id);
    console.log(req.body);
    try{
        const results = await db.query("UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 returning *",
         [req.body.name, req.body.location, req.body.price_range, req.params.id]);
         console.log(results);
        res.status(200).json({
            status: "success",
            data: {
                restaurant: results.rows[0]
            }
        });
    }catch(err){
        console.log(err);
    }
});

//Delete a restaurant
app.delete("/api/v1/restaurants/:id", async (req, res)=> {
    try{
        const results = await db.query("DELETE FROM restaurants WHERE id = $1", [req.params.id]);
        res.status(204).json({
            status: "success"
        });
    }catch(err){
        console.log(err);
    }
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Server up and running in port ${port}`);
});