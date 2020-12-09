import React, {useState, useContext} from 'react';
import RestaurantFinder from '../apis/RestaurantFinder';
import {RestaurantsContext} from '../context/RestaurantContext';

const AddRestaurant = () => {
    const {addRestaurants} = useContext(RestaurantsContext);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [priceRange, setPriceRange] = useState("Price Range");

    const handleSubmit = async (event) => {
        event.preventDefault(); //prevent the page reload
        try{
            const response = await RestaurantFinder.post("/", {
                name: name,
                location: location,
                price_range: priceRange
            });
            addRestaurants(response.data.data.restaurant);
            console.log(response);
        }catch(err){
            console.log(err);
        }
    }

    return (
        <div>
            <div className="mb-4">
                <form action="">
                    <div className="form-row">
                        <div className="col">
                            <input type="text" className="form-control" placeholder="name" value={name} onChange={(event) => setName(event.target.value)}/>
                        </div>
                        <div className="col">
                            <input type="text" className="form-control" placeholder="location" value={location} onChange={(event) => setLocation(event.target.value)}/>
                        </div>
                        <div className="col">
                            <select className="custom-select my-1 mr-sm-2" value={priceRange} onChange={(event) => setPriceRange(event.target.value)}>
                                <option disabled>Price Range</option>
                                <option value="1">$</option>
                                <option value="2">$$</option>
                                <option value="3">$$$</option>
                                <option value="4">$$$$</option>
                                <option value="5">$$$$$</option>
                            </select>
                        </div>
                        <button onClick={handleSubmit} type="submit" className="btn btn-primary">Add</button>
                    </div>
                </form>
            </div>
        </div>
    )
};
export default AddRestaurant;
