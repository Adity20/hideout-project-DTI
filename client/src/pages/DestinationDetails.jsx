import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const DestinationDetails = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRecommendations, setUserRecommendations] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3000/api/places/getplace/${id}`)
      .then(response => {
        setUserRecommendations(response.data[0]);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!mapLoaded && userRecommendations) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=api&libraries=places`;
      script.onload = () => {
        setMapLoaded(true);
      };
      document.body.appendChild(script);
    }
  }, [userRecommendations, mapLoaded]);

  useEffect(() => {
    if (mapLoaded && userRecommendations) {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: userRecommendations.coordinates[0], lng: userRecommendations.coordinates[1] },
        zoom: 10,
      });

      new window.google.maps.Marker({
        position: { lat: userRecommendations.coordinates[0], lng: userRecommendations.coordinates[1] },
        map,
        title: userRecommendations.place_name,
      });
    }
  }, [userRecommendations, mapLoaded]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !userRecommendations) {
    return <div>Error fetching data.</div>;
  }
  const handleVisitBut = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:3000/api/places/addtovisited/${id}`, {
      user_obj_id: currentUser._id,
    })
      .then(response => {
        alert(response.data.msg);
      })
      .catch(err => {
        console.log('Error:', err);
        alert('Error occurred while adding place to visited places.');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  return (
    <div className='flex max-w-[1640px] m-auto px-2 py-6'>
      <img className="h-1/2 w-1/2 rounded-lg object-cover object-center" src={userRecommendations.filepath} alt={userRecommendations.place_name} />
      <div className='px-2 py-6'>
        <div className='px-1 py-3'>
          <div className='px-1 py-1'>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">{userRecommendations.place_name}</span>
            </h1>
          </div>
          <div className='px-1 py-1'></div>
        </div>
        <p className="max-w-lg text-2xl leading-normal text-gray-900 dark:text-grey-900">{userRecommendations.type}</p>
        <p className="max-w-lg text-2xl leading-normal text-gray-900 dark:text-grey-900">uploaded by: {userRecommendations.username}</p>
        <p className="max-w-lg text-2xl leading-normal text-gray-900 dark:text-grey-900">likes: {userRecommendations.likes}</p>
        <p className="max-w-lg text-2xl leading-normal text-gray-900 dark:text-grey-900">{userRecommendations.story}</p>
        <br />
        <div id="map" style={{ width: '200%', height: '400px' }}></div>
        <br />
        <button
          type="button"
          className="px-4 py-2 text-base font-medium text-white bg-blue-700 hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-primary rounded-lg text-center dark:bg-primary dark:hover:bg-secondary dark:focus:ring-secondary"
          onClick={handleVisitBut}
        >
          Add to Visited Places
        </button>
      </div>
    </div>
  );
};

export default DestinationDetails;
