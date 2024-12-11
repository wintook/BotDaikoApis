const axios = require("axios");

const getProfile =  async (api_access_token) => {
    const domain = "https://dev.wintook.com";
    const options = {
        method: "GET",
        url: `${domain}/api/v1/profile`,
        headers: {
            api_access_token,
        },
    };

    try {
        const response = await  axios.request(options);
        return response.data;
    } catch (error) {
        console.error("Error fetching profile:", error.message);
        return false;
    }
};

module.exports = {
    getProfile
}