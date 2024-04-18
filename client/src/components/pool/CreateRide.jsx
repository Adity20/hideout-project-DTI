import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CreateRide = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    StartDate: '',
    EndDate: '',
    Origin: '',
    Destination: '',
    Budget: '',
    Description: '',
    MaxCapacity: ''// Initialize as empty string
  });

  // Update user_obj_id when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData(prevFormData => ({
        ...prevFormData,
        user_obj_id: currentUser._id
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/api/addtrip', formData);
      alert(response.data.msg);
      // Handle success, show message or redirect
    } catch (error) {
      console.error('Error:', error);
      setError('Error submitting form. Please try again.'); // Update error state
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w mx-auto mt-8 p-8 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="StartDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            id="StartDate"
            name="StartDate"
            type="date"
            value={formData.StartDate}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="EndDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            id="EndDate"
            name="EndDate"
            type="date"
            value={formData.EndDate}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="Origin" className="block text-sm font-medium text-gray-700">
            Origin
          </label>
          <input
            id="Origin"
            name="Origin"
            type="text"
            value={formData.Origin}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Origin"
            required
          />
        </div>
        <div>
          <label htmlFor="Destination" className="block text-sm font-medium text-gray-700">
            Destination
          </label>
          <input
            id="Destination"
            name="Destination"
            type="text"
            value={formData.Destination}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Destination"
            required
          />
        </div>
        <div>
          <label htmlFor="Budget" className="block text-sm font-medium text-gray-700">
            Budget
          </label>
          <input
            id="Budget"
            name="Budget"
            type="number"
            value={formData.Budget}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Budget"
            required
          />
        </div>
        <div>
          <label htmlFor="Description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="Description"
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Description"
            required
          />
        </div>
        <div>
          <label htmlFor="MaxCapacity" className="block text-sm font-medium text-gray-700">
            Max Capacity
          </label>
          <input
            id="MaxCapacity"
            name="MaxCapacity"
            type="number"
            value={formData.MaxCapacity}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Max Capacity"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default CreateRide;

