import Api from "../api";

export default {
  async getAll(apiEndpoint, options) {
    try {
      const response = await Api.get(apiEndpoint, options);
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error?.response?.data &&
        error?.response?.data?.status?.message
      ) {
        throw new Error(error?.response?.data?.status?.message);
      } else {
        throw new Error("An error occurred while creating the item.");
      }
    }
  },

  async getById(apiEndpoint, id) {
    try {
      const response = await Api.get(`${apiEndpoint}/${id}`);
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error?.response?.data &&
        error?.response?.data?.status?.message
      ) {
        throw new Error(error?.response?.data?.status?.message);
      } else {
        throw new Error("An error occurred while reading the data.");
      }
    }
  },

  async create(apiEndpoint, payload) {
    try {
      const response = await Api.post(apiEndpoint, payload);
      return response?.data;
    } catch (error) {
      if (
        error.response &&
        error?.response?.data &&
        error?.response?.data?.status?.message
      ) {
        throw new Error(error?.response?.data?.status?.message);
      } else {
        throw new Error("An error occurred while creating the state.");
      }
    }
  },

  async update(apiEndpoint, id, payload) {
    try {
      const response = await Api.patch(`${apiEndpoint}/${id}`, payload);
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error?.response?.data &&
        error?.response?.data?.status?.message
      ) {
        throw new Error(error?.response?.data?.status?.message);
      } else {
        throw new Error("An error occurred while updating.");
      }
    }
  },

  async patch(apiEndpoint, payload) {
    try {
      const response = await Api.patch(`${apiEndpoint}`, payload);
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error?.response?.data &&
        error?.response?.data?.status?.message
      ) {
        throw new Error(error?.response?.data?.status?.message);
      } else {
        throw new Error("An error occurred while updating.");
      }
    }
  },

  async delete(apiEndpoint, id) {
    try {
      const response = await Api.delete(`${apiEndpoint}/${id}`);
      return response?.data;
    } catch (error) {
      if (
        error.response &&
        error?.response?.data &&
        error?.response?.data?.status?.message
      ) {
        throw new Error(error?.response?.data?.status?.message);
      } else {
        throw new Error("An error occurred while deleting.");
      }
    }
  },
};
