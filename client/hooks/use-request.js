// client\hooks\use-request.js
import axios from 'axios';
import { useState } from 'react';

export const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  console.log('method', method);

  const doRequest = async () => {
    setErrors(null);
    try {
      const response = await axios[method](url, body);
      if (onSuccess) onSuccess(response.data);

      return response.data;
    } catch (err) {
      console.log('error', err);
      setErrors(
        <div className='alert alert-danger'>
          <h4>Ooops...</h4>
          <ul className='my-0'>
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return {
    doRequest,
    errors,
  };
};
