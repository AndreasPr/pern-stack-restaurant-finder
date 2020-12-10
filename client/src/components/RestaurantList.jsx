import React, {useEffect, useContext} from 'react';
import RestaurantFinder from '../apis/RestaurantFinder';
import {RestaurantsContext} from '../context/RestaurantContext';
import {useHistory} from 'react-router-dom';
import StarRating from './StarRating';

const RestaurantList = (props) => {

    const {restaurants, setRestaurants} = useContext(RestaurantsContext);
    let history = useHistory(); //History of the browser

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await RestaurantFinder.get("/") //Returns a Promise
                setRestaurants(response.data.data.restaurants);
            }catch(err){
                console.log(err);
            }
        }
        fetchData();
    }, []); //We put [] because it runs when the component mounts, it would not run ever again

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try{
            const response = await RestaurantFinder.delete(`/${id}`);
            setRestaurants(restaurants.filter((restaurant) => {
                return restaurant.id !== id
            }));
        }catch(err){
            console.log(err);
        }
    };

    const handleUpdate = (e, id) => {
        e.stopPropagation();
        history.push(`/restaurants/${id}/update`);
    };

    const handleRestaurantSelect = (id) => {
        history.push(`/restaurants/${id}`);
    }

    const renderRating = (restaurant) => {
        if(!restaurant.count){
            return <span className="text-warning">0 reviews</span>
        }
        return(
            <>
                <StarRating rating = {restaurant.id}/>
                <span className="text-warning ml-1">({restaurant.count})</span>
            </>
        );
    }

    return (
        <div className="list-group">
            <table className="table table-hover table-dark">
                <thead>
                    <tr className="bg-primary">
                        <th scope="col">Restaurant</th>
                        <th scope="col">Location</th>
                        <th scope="col">Price Range</th>
                        <th scope="col">Ratings</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {restaurants && restaurants.map((restaurant) => {
                        return(
                            <tr onClick={() => handleRestaurantSelect(restaurant.id)} key={restaurant.id}>
                                <td>{restaurant.name}</td>
                                <td>{restaurant.location}</td>
                                <td>{"$".repeat(restaurant.price_range)}</td>
                                <td>{renderRating(restaurant)}</td>
                                <td><button onClick={(e) => handleUpdate(e, restaurant.id)} className="btn btn-warning">Update</button></td>
                                <td><button onClick={(e) => handleDelete(e, restaurant.id)} className="btn btn-danger">Delete</button></td>
                            </tr>
                        );  
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default RestaurantList;
