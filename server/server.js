require("dotenv").config();
const express = require("express");
const db = require("./db");
const morgan = require("morgan");
const app = express();

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
        console.log(results);
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
app.get("/api/v1/restaurants/:id", (req,res)=>{
    console.log(req.params);
    res.status(200).json({
        status: "success",
        data: {
            restaurant: "mcdonalds"
        }
    });
});

//Create a restaurant
app.post("/api/v1/restaurants", (req, res) => {
    console.log(req.body);
    res.status(201).json({
        status: "success",
        data: {
            restaurant: "mcdonalds"
        }
    });
});

//Update restaurant
app.put("/api/v1/restaurants/:id", (req, res) => {
    console.log(req.params.id);
    console.log(req.body);
    res.status(200).json({
        status: "success",
        data: {
            restaurant: "mcdonalds"
        }
    })
});

//Delete a restaurant
app.delete("/api/v1/restaurants/:id", (req, res)=> {
    res.status(204).json({
        status: "success"
    });
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Server up and running in port ${port}`);
});