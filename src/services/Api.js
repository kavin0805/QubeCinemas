import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export const getCollections = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/collections`);
    return response.data;
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
};

export const getCollectionDetails = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/collectionDetails/${id}`);    
    return response.data;
  } catch (error) {
    console.error('Error fetching collection details:', error);
    throw error;
  }
};