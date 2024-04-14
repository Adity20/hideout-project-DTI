import  { useState , useEffect } from 'react'
import { useSelector } from 'react-redux';

import axios from 'axios';

const Uploaded = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userRecommendations, setUserRecommendations] = useState([]);
  useEffect(() => {
    // Axios GET request to fetch top-rated places from the backend
    axios.get(`http://localhost:3000/api/places/user_uploads/${currentUser._id}`)
      .then(response => {
        console.log(response.data);
        // Update the state with the fetched data
        setUserRecommendations(response.data);
      })
      .catch(error => {
        // Log any errors that occur during the fetch operation
        console.error('Error fetching user-uploaded places:', error);
      });
  }, []);

  return (
    
    <div className='max-w-[1640px] m-auto px-4 py-12'>
      <h1 className='text-primary font-bold text-4xl text-center'>
        Your Uploaded Spots
      </h1>
        <div className='grid  lg:grid-cols-3 gap-10 pt-10'>
            {userRecommendations.map((item) => (
            <div
                key={item._id}
                className='border shadow-lg rounded-lg hover:scale-105 duration-300'
            >
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
            ))}
        </div>
        {/* <button className='border-white bg-white text-black mx-2 absolute bottom-4'>Explore</button> */}
    </div>
  )
}

export default Uploaded