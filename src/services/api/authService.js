import api from "../api";

const apiEndpoint = "auth";
export default {
  async sign(payload, signType = "signin") {
    try {
      const response = await api.post(`${apiEndpoint}/${signType}`, payload);
      localStorage.setItem("token", response?.data?.access_token);
      return response?.data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("An error occurred while creating the signing in.");
      }
    }
  },

  async getMe() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await api.get(`${apiEndpoint}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log({ me: response?.data });
      return response?.data;
    } catch (error) {
      localStorage.removeItem("token");
      console.log(error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Please login first.");
      }
    }
  },

  async logout() {
    try {
      const response = await api.get(`${apiEndpoint}/logout`);
      localStorage.removeItem("token");
      return response?.data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("An error occurred while creating the signing in.");
      }
    }
  },
};
