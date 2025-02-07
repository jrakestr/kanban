// Parameter: Authorization
// Format: Bearer ${token}

import Auth from '../utils/auth';

const retrieveUsers = async () => {
  try {
    const response = await fetch(`${process.env.VITE_API_BASE_URL || '/api'}/users`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`
      }
    });
    const data = await response.json();

    if(!response.ok) {
      throw new Error('invalid user API response, check network tab!');
    }

    return data;

  } catch (err) { 
    console.log('Error from data retrieval:', err);
    return [];
  }
}

export { retrieveUsers };
