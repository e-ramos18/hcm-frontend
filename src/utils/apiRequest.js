import api from "../services/api";

async function apiRequest(method, endpoint, data = null) {
  try {
    const response = await api[method](endpoint, data);
    return [response.data, null];
  } catch (err) {
    return [null, err.response ? err.response.data : err];
  }
}

export default apiRequest;
