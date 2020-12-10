import React, {useState, useEffect, useContext} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import RestaurantFinder from '../apis/RestaurantFinder';
import {RestaurantsContext} from '../context/RestaurantContext';

const UpdateRestaurant = (props) => {
    const {restaurants} = useContext(RestaurantsContext);
    const {id} = useParams();
    let history = useHistory();
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [priceRange, setPriceRange] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const response = await RestaurantFinder.get(`/${id}`);
            setName(response.data.data.restaurant.name);
            setLocation(response.data.data.restaurant.location);
            setPriceRange(response.data.data.restaurant.price_range);
        };
        fetchData();
    },[]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const updatedRestaurant = await RestaurantFinder.put(`/${id}`, {
            name: name, 
            location: location,
            price_range: priceRange
        });
        history.push("/");
    };

    return (
        <div>
            <form action="">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input id="name" className="form-control" type="text" value={name} onChange={(event) => setName(event.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input id="location" className="form-control" type="text" value={location} onChange={(event) => setLocation(event.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="price_range">Price Range</label>
                    <input id="price_range" className="form-control" type="number" value={priceRange} onChange={(event) => setPriceRange(event.target.value)}/>
                </div>
                <button type="submit" onClick={handleSubmit} className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
};
export default UpdateRestaurant;
