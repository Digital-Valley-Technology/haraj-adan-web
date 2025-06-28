import { axiosInstance } from "./axios";

export default {
  async get(url = "/", options = {}) {
    try {
      const response = await axiosInstance.get(url, options);
      return response;
    } catch (error) {
      console.error("Error in get:", error);
      throw error;
    }
  },

  async post(url = "/", data, options = {}) {
    try {
      const response = await axiosInstance.post(url, data, options);
      return response;
    } catch (error) {
      console.error("Error in post:", error);
      throw error;
    }
  },

  async put(url = "/", data, options = {}) {
    try {
      const response = await axiosInstance.put(url, data, options);
      return response;
    } catch (error) {
      console.error("Error in put:", error);
      throw error;
    }
  },

  async patch(url = "/", data, options = {}) {
    try {
      const response = await axiosInstance.patch(url, data, options);
      return response;
    } catch (error) {
      console.error("Error in patch:", error);
      throw error;
    }
  },

  async delete(url = "/", options = {}) {
    try {
      const response = await axiosInstance.delete(url, options);
      return response;
    } catch (error) {
      console.error("Error in delete:", error);
      throw error;
    }
  },
};
