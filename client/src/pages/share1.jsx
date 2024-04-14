import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const FormComponent = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    placename: '',
    story: '',
    type: '',
    user_id: currentUser._id,
    image: null,
    coordinates: { lat: 0, lng: 0 } // Initialize coordinates
  });
  const [searchLocation, setSearchLocation] = useState('');
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    // Load Google Maps API
    const loadMapScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDRt-VDa48N-6NW2_OKHWdiWJGw0g3J9Fg&libraries=places`;
      script.defer = true;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    // Initialize map
    const initMap = () => {
      const mapInstance = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 0, lng: 0 },
        zoom: 4,
      });

      // Create a marker
      const markerInstance = new window.google.maps.Marker({
        position: { lat: 0, lng: 0 },
        map: mapInstance,
        draggable: true, // Make the marker draggable
      });

      // Set marker to state
      setMarker(markerInstance);

      // Add event listener to marker drag
      markerInstance.addListener('dragend', () => {
        const position = markerInstance.getPosition();
        setFormData(prevState => ({
          ...prevState,
          coordinates: { lat: position.lat(), lng: position.lng() }
        }));
      });

      setMap(mapInstance);
    };

    // Call loadMapScript when component mounts
    loadMapScript();

  }, []); // Empty dependency array to run only once when component mounts

  useEffect(() => {
    if (map && searchLocation) {
      // Use Geocoding API to convert location to coordinates
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: searchLocation }, (results, status) => {
        if (status === 'OK') {
          map.setCenter(results[0].geometry.location);
          map.setZoom(10);
          marker.setPosition(results[0].geometry.location); // Move the marker to the new location
          setFormData(prevState => ({
            ...prevState,
            coordinates: { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() }
          }));
        } else {
          console.error('Geocode was not successful for the following reason:', status);
        }
      });
    }
  }, [searchLocation, map, marker]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('placename', formData.placename);
      formDataToSend.append('story', formData.story);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('user_id', currentUser._id);
      formDataToSend.append('image', formData.image);
      formDataToSend.append('coordinates', JSON.stringify(formData.coordinates)); // Send coordinates as string
      const response = await axios.post('http://localhost:3000/api/upload', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(response.data.msg);
      // Handle success, show message or redirect
    } catch (error) {
      console.error('Error:', error);
      // Handle error, show error message
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-8 bg-white rounded-lg shadow-md">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="placename" className="block text-sm font-medium text-gray-700">
            Place Name
          </label>
          <input
            id="placename"
            name="placename"
            type="text"
            value={formData.placename}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter Place Name"
          />
        </div>
        <div>
          <label htmlFor="story" className="block text-sm font-medium text-gray-700">
            Story
          </label>
          <textarea
            id="story"
            name="story"
            value={formData.story}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter Story"
          />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Type</option>
            <option value="Type1">Type1</option>
            <option value="Type2">Type2</option>
            <option value="Type3">Type3</option>
          </select>
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="searchLocation" className="block text-sm font-medium text-gray-700">
            Enter a location to make a map
          </label>
          <input
            id="searchLocation"
            name="searchLocation"
            type="text"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter Location"
          />
        </div>
        <div id="map" className="h-96"></div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-4 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormComponent;