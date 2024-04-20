import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Shared = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [geoRecommendations, setGeoRecommendations] = useState([]);
  const [type, setType] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [maxDistance, setMaxDistance] = useState(5000); // Initial value for maximum distance
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user recommendations
    axios.get(`http://localhost:3000/api/places/user-rec/${currentUser._id}/${currentUser.username}`)
      .then(response => {
        setUserRecommendations(response.data);
      })
      .catch(error => {
        console.error('Error fetching user recommendations:', error);
      });
  }, [currentUser]);

  useEffect(() => {
    // Request user's location and fetch geo-based recommendations
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });

          // Fetch georecommendations based on user location and selected max distance
          axios.get(`http://localhost:3000/api/places/georec/?latitude=${latitude}&longitude=${longitude}&maxDistance=${maxDistance}&userId=${currentUser._id}`)
            .then(response => {
              setGeoRecommendations(response.data);
            })
            .catch(error => {
              console.error('Error fetching geo recommendations:', error);
            });
        },
        error => {
          setError("Unable to retrieve your location. Please enable location services.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, [maxDistance]); // Re-fetch geo-recommendations when maxDistance changes

  useEffect(() => {
    // Fetch type-based recommendations
    axios.get(`http://localhost:3000/api/places/type-rec/random?userId=${currentUser._id}`)
      .then(response => {
        setType(response.data.type);
        setRecommendations(response.data.recommendations);
      })
      .catch(error => {
        console.error('Error fetching type-based recommendations:', error);
      });
  }, [currentUser]);

  // Function to handle changes in max distance
  const handleMaxDistanceChange = (event) => {
    setMaxDistance(event.target.value);
  };

  return (
    <div className='max-w-[1640px] m-auto px-4 py-12'>
      <h1 className='text-primary font-bold text-4xl text-center'>
        Top Shared Places/Stories
      </h1>
  
      {/* User-based recommendations */}
      <div className='mt-8'>
        <h2 className='text-primary font-bold text-2xl'>User-based Recommendations</h2>
        <div className='grid lg:grid-cols-3 gap-10 pt-4'>
          {userRecommendations.map((item) => (
            <Link to={`/destination/${item._id}`} key={item._id}>
              <div className='border shadow-lg rounded-lg hover:scale-105 duration-300'>
                {/* Render user recommendation data here */}
                <img
                  src={item.filepath}
                  alt={item.place_name}
                  className='w-full h-[300px] object-cover rounded-t-lg'
                />
                <div className='flex justify-between px-2 py-4'>
                  <p className='font-bold'>{item.place_name}</p>
                  <p>
                    <span className='bg-primary text-white p-1 rounded-full'>
                      {item.likes}
                    </span>
                  </p>
                </div>
                <div className='flex justify-between px-4 py-4'>
                  <p className='font'>{item.story}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
  
      {/* Geo-based recommendations */}
      <div className='mt-8'>
        <h2 className='text-primary font-bold text-2xl'>Geo-based Recommendations</h2>
        <div className='flex items-center mt-4'>
          <label htmlFor='maxDistance' className='mr-2'>Max Distance (meters):</label>
          <input
            type='number'
            id='maxDistance'
            value={maxDistance}
            onChange={handleMaxDistanceChange}
            className='border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary'
          />
        </div>
        <div className='grid lg:grid-cols-3 gap-10 pt-4'>
          {geoRecommendations.map((item) => (
            <Link to={`/destination/${item.place_id}`} key={item.place_id}>
              <div className='border shadow-lg rounded-lg hover:scale-105 duration-300'>
                {/* Render geo recommendation data here */}
                <img
                  src={item.filepath}
                  alt={item.place_name}
                  className='w-full h-[300px] object-cover rounded-t-lg'
                />
                <div className='flex justify-between px-2 py-4'>
                  <p className='font-bold'>{item.place_name}</p>
                  <p>
                    <span className='bg-primary text-white p-1 rounded-full'>
                      {item.likes}
                    </span>
                  </p>
                </div>
                <div className='flex justify-between px-4 py-4'>
                  <p className='font'>{item.story}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Type-based recommendations */}
      <div className='mt-8'>
        <h2 className='text-primary font-bold text-2xl'>Because you liked {type}</h2>
        <div className='grid lg:grid-cols-3 gap-10 pt-4'>
          {recommendations.map((item) => (
            <Link to={`/destination/${item._id}`} key={item._id}>
              <div className='border shadow-lg rounded-lg hover:scale-105 duration-300'>
                {/* Render type recommendation data here */}
                <img
                  src={item.filepath}
                  alt={item.place_name}
                  className='w-full h-[300px] object-cover rounded-t-lg'
                />
                <div className='flex justify-between px-2 py-4'>
                  <p className='font-bold'>{item.place_name}</p>
                  <p>
                    <span className='bg-primary text-white p-1 rounded-full'>
                      {item.likes}
                    </span>
                  </p>
                </div>
                <div className='flex justify-between px-4 py-4'>
                  <p className='font'>{item.story}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shared;
