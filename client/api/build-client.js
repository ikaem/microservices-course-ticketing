// client\api\build-file.js

import axios from 'axios';

export const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL: 'http://www.angrychaired.xyz',
      headers: req.headers,
    });
  } else {
    // browser environment

    return axios.create({
      baseURL: '',
    });
  }
};
