// updateToken.js

import API_BASE_URL from "../config/apiConfig";

const fetchNewAccessToken = async () => {
    const language = localStorage.getItem('language');
    try {
        const response = await fetch(`${API_BASE_URL}/jwt-auth/api/update-access-token`, {
            headers: {'Accept-Language': `${language}`},
            method: 'POST', credentials: 'include'
        });

        const data = await response.json();
        if (response.ok) {
            // Update access token successful
            console.log(data.status.message);
            return data.token;
        } else {
            console.log(data.status.message);
            new Error('Failed to update access token');
        }

    } catch (error) {
        console.error('Error fetching new access token:', error);
        throw error;
    }
};

const updateAccessToken = async () => {
    try {
        const newAccessToken = await fetchNewAccessToken();
        localStorage.setItem('accessToken', newAccessToken);
        console.log('Access token updated successfully');
    } catch (error) {
        console.error('Error updating access token:', error);
    }
};

export {updateAccessToken};

