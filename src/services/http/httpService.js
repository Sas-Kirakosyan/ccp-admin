import axios from 'axios';

// dependencies
import tokenInterceptor from './tokenInterceptor';
import { HttpMethods } from './constants';

// interceptors change axios HTTP call config
axios.interceptors.request.use(tokenInterceptor);

// default configurations
axios.defaults.baseURL = process.env.REACT_APP_CCP_API;
axios.defaults.headers.common['Content-type'] = 'application/json';

export function get(url, params, responseType) {
  const config = {
    method: HttpMethods.GET,
    params,
    url,
    responseType,
  };
  return httpCall(config);
}

export function post(url, data) {
  const config = {
    method: HttpMethods.POST,
    data,
    url,
  };
  return httpCall(config);
}

export function put(url, data) {
  const config = {
    method: HttpMethods.PUT,
    data,
    url,
  };
  return httpCall(config);
}

export function deleteAction(url, data) {
  const config = {
    method: HttpMethods.DELETE,
    url,
    data,
  };
  return httpCall(config);
}

async function httpCall(baseConfig) {
  const req = await axios.request(baseConfig);
  return req.data;
}
