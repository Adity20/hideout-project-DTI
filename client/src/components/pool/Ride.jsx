import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
const Ride = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { id } = useParams(); // Assuming you have a trip ID in the URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ride, setRide] = useState(null);

  useEffect(() => {
    // Fetch ride details based on tripId
    const fetchRideDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/trips/getone/${id}`);
        setRide(response.data[0]);
      } catch (error) {
        console.error('Error fetching ride details:', error);
        setError('Error fetching ride details');
      }
    };

    fetchRideDetails();
  }, [id]);

  const handleJoinTrip = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:3000/api/trips/${id}/join/${currentUser._id}`);
      alert(response.data.message); // Optionally show a success message
      // Handle success, update UI or redirect
    } catch (error) {
      console.error('Error joining trip:', error);
      setError('Error joining trip. Please try again.',error);
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Adjust format as needed
  };
  if (!ride) {
    return <div>Loading...</div>; // Or some loading indicator
  }

  return (
    <div className='flex max-w-[1640px] m-auto px-4 py-12'>
      <img className="h-1/2 w-1/1/2 rounded-lg  object-cover object-center" src='http://localhost:3000/images/Frame1.png' alt={ride.name} />
      <div className='px-12 py-24'>
        <h2 className='mb-4 text-5xl font-extrabold'>{ride.name}</h2>
        <p className="max-w-lg text-3xl font-semibold leading-normal text-gray-900 dark:text-grey">{ride.Origin} &#10148; {ride.Destination}</p>
        <p className="max-w-lg text-2xl leading-normal text-gray-900 dark:text-grey-900">Start Date: {formatDate(ride.StartDate)}</p>
        <p className="max-w-lg text-2xl leading-normal text-gray-900 dark:text-grey-900">End Date: {formatDate(ride.EndDate)}</p>
        <p className="max-w-lg text-2xl leading-normal text-gray-900 dark:text-grey-900">Budget: {ride.Budget}</p>
        <p className="max-w-lg text-2xl leading-normal text-gray-900 dark:text-grey-900">Description: {ride.Description}</p>
        <p className="max-w-lg text-2xl leading-normal text-gray-900 dark:text-grey-900">Passengers Left: {ride.PassengersLeft}</p>
        <p className="max-w-lg text-2xl leading-normal text-gray-900 dark:text-grey-900">{ride.description}</p>
        <br />
        <button
          type="button"
          className={`px-6 py-3.5 text-base font-medium text-white bg-blue-700 hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-primary rounded-lg text-center dark:bg-primary dark:hover:bg-secondary dark:focus:ring-secondary ${loading || ride.PassengersLeft <= 0 ? 'cursor-not-allowed opacity-50' : ''}`}
          onClick={handleJoinTrip}
          disabled={loading || ride.PassengersLeft <= 0}
        >
          {loading ? 'Joining...' : ride.PassengersLeft <= 0 ? 'Trip Full' : 'Join trip'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default Ride;
