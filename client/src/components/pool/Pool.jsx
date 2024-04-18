import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Pool = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRides = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/trips'); // Adjust URL as per your backend route
        setRides(response.data);
      } catch (error) {
        console.error('Error fetching rides:', error);
        setError('Error fetching rides');
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Adjust format as per your requirement
  };

  return (
    <>
      <div className='max-w-[1640px] mx-auto px-4 py-8 '>
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-black">RIDES!</h1>

        <Link to={"/createride"}>
          <p className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-primary rounded-lg hover:bg-secondary focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
            Create a new Ride
            <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
            </svg>
          </p>
        </Link>

        <div className='grid lg:grid-cols-3 gap-10 pt-10'>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            rides.map((item) => (
              <div key={item._id}>
                {item.PassengersLeft === 0 ? (
                  <div className='border shadow-lg rounded-lg duration-300 opacity-50'>
                    <div className='flex justify-between px-4 py-0'>
                      <p className='font'>Start Date: {formatDate(item.StartDate)}</p>
                      <svg className="w-4 h-4 text-gray-400 mx-2 mt-1" fill="black" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <p className='font'>End Date: {formatDate(item.EndDate)}</p>
                    </div>
                    <div className='flex justify-between px-4 py-0'>
                      <p className='font'>Origin: {item.Origin}</p>
                      <svg className="w-4 h-4 text-gray-400 mx-2 mt-1" fill="black" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <p className='font'>Destination: {item.Destination}</p>
                    </div>
                    <div className='flex justify-between px-4 py-0'>
                      <p className='font'>Leaving Time: {item.Time}</p>
                    </div>
                    <div className='flex justify-between px-4 py-0'>
                      <p className='font'>Duration: {item.JTime}</p>
                    </div>
                    <p className='font-bold text-center text-red-500'>Full - No Seats Available</p>
                  </div>
                ) : (
                  <Link to={`/ride/${item._id}`}>
                    <div className='border shadow-lg rounded-lg hover:scale-105 duration-300 relative'>
                      <div className='flex justify-between px-4 py-0'>
                        <p className='font'>Start Date: {formatDate(item.StartDate)}</p>
                        <svg className="w-4 h-4 text-gray-400 mx-2 mt-1" fill="black" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p className='font'>End Date: {formatDate(item.EndDate)}</p>
                      </div>
                      <div className='flex justify-between px-4 py-0'>
                        <p className='font'>Origin: {item.Origin}</p>
                        <svg className="w-4 h-4 text-gray-400 mx-2 mt-1" fill="black" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p className='font'>Destination: {item.Destination}</p>
                      </div>
                      <div className='flex justify-between px-4 py-0'>
                        <p className='font'>Leaving Time: {item.Time}</p>
                      </div>
                      <div className='flex justify-between px-4 py-0'>
                        <p className='font'>Duration: {item.JTime}</p>
                      </div>
                      <p className='font-bold text-center'>Seats Left: {item.PassengersLeft}</p>
                    </div>
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Pool;
