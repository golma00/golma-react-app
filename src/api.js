import axios from "axios"

export const elmApi = axios.create({
    baseURL: process.env.REACT_ELM_API_URL,
    // timeout: 1000 * 10,
});
export const mlmApi = axios.create({
  baseURL: process.env.REACT_MLM_API_URL,
  // timeout: 1000 * 10,
});
const apiMode = process.env.REACT_APP_MODE;

elmApi.defaults.withCredentials = true;
elmApi.interceptors.request.use(
    async (config) => {
        config.headers['Content-Type'] = 'application/json';
        if (apiMode === 'local') {
          console.log(config.method + " " + config.url);
        }
        return config;
    },
    (error) => {
        if (apiMode === 'local') {
          console.error('elmApi axios 요청 오류:', error);
        }
        return Promise.reject(error);
    }
);
elmApi.interceptors.response.use(
  async (response) => {
    if (apiMode === 'local') {
      console.log(response.data);
    }
    return response;
  },
  async (error) => {
    if (apiMode === 'local') {
      console.error("elmApi axios 응답 오류:", error);
    }
    return Promise.reject(error);
  }
);

mlmApi.defaults.withCredentials = true;
mlmApi.interceptors.request.use(
    async (config) => {
      config.headers['Content-Type'] = 'application/json';
      if (apiMode === 'local') {
        console.log(config.method + " " + config.url);
      }
      return config;
    },
    (error) => {
      if (apiMode === 'local') {
        console.error('mlmApi axios 요청 오류:', error);
      }
      return Promise.reject(error);
    }
);
mlmApi.interceptors.response.use(
  async (response) => {
    if (apiMode === 'local') {
      console.log(response.data);
    }
    return response;
  },
  async (error) => {
    if (apiMode === 'local') {
      console.error("mlmApi axios 응답 오류:", error);
    }
    return Promise.reject(error);
  }
);