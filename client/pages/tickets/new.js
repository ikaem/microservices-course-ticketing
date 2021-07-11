import { useState } from 'react';
import Router from 'next/router';
import { useRequest } from '../../hooks/use-request';

// client\pages\tickets\new.js
const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => {
      console.log('do something when ok');
      Router.push('/');
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) return;

    setPrice(value.toFixed(2));
  };
  return (
    <div>
      <h1>Create a ticket</h1>

      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='title'>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type='text'
            className='form-control'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='price'>Price</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onBlur}
            type='number'
            className='form-control'
          />
        </div>
        {errors}
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
