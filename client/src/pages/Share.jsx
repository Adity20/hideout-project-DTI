import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const FormComponent = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    placename: '',
    story: '',
    type: '',
    user_id: currentUser._id,
    image: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
    const formDataToSend = new FormData();
    formDataToSend.append('placename', formData.placename);
    formDataToSend.append('story', formData.story);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('user_id',currentUser._id);
    formDataToSend.append('image', formData.image);
      const response = await axios.post('http://localhost:3000/api/upload', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Response:', response.data);
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
