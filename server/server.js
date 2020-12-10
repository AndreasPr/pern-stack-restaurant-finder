require("dotenv").config();
const cors = require("cors");
const express = require("express");
const db = require("./db");
const morgan = require("morgan");
const e = require("express");
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
        const restaurantRatingsData = await db.query("SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) as average_rating FROM reviews GROUP BY restaurant_id) reviews ON restaurants.id = reviews.restaurant_id;");
        res.status(200).json({
            status: "success",
            results: restaurantRatingsData.rows.length,
            data: {
                restaurants: restaurantRatingsData.rows
            }
        });
    }catch(err){
        console.log(err);
    }
});

//Get a restaurant
app.get("/api/v1/restaurants/:id", async (req,res)=>{
    try{
        const restaurant = await db.query("SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) as average_rating FROM reviews GROUP BY restaurant_id) reviews ON restaurants.id = reviews.restaurant_id WHERE id = $1", [req.params.id]);
        const reviews = await db.query("select * from reviews where restaurant_id = $1", [req.params.id]);

        res.status(200).json({
            status: "success",
            data: {
                restaurant: restaurant.rows[0],
                reviews: reviews.rows
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

//Add a review
app.post("/api/v1/restaurants/:id/addReview", async (req, res) =>{
    try{
        const results = await db.query("INSERT INTO reviews (restaurant_id, name, review, rating) VALUES ($1, $2, $3, $4) returning *",
         [req.params.id, req.body.name, req.body.review, req.body.rating]);

         res.status(201).json({
            status: "success",
            data: {
                review: results.rows[0]
            }
         });
    }
    catch(err){
        console.log(err);
    }
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Server up and running in port ${port}`);
});