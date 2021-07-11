import Router from 'next/router';
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { useRequest } from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const { expiresAt, id } = order;
  const [seconds, setSeconds] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    mthod: 'post',
    body: { orderId: id },
    onSuccess: (data) => {
      console.log('did on success');
      Router.push('/orders/orders');
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const secondsRemaining = Math.floor(
        (new Date(expiresAt) - new Date()) / 1000
      );
      if (secondsRemaining >= 0) setSeconds(secondsRemaining);
    };

    findTimeLeft();

    const intervalId = setInterval(() => {
      findTimeLeft();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  console.log({ seconds });

  if (seconds === 0) return <div>Order expired</div>;

  return (
    <div>
      Order
      <div>
        {!!seconds && <div>{seconds} seconds left until the order expires</div>}
      </div>
      <StripeCheckout
        token={({ id }) => {
          console.log('token', id);
          () => doRequest({ token: id });
        }}
        stripeKey='pk_test_51JAIoQBmBwN2aPYSKMqLn8D03LB6ZPyFWBetnggnEeu3YgHDym6LEZZCEeN5niaTtS79Uc1NbNQvD6blJE52jnfO00J0JUT9TZ'
        amount={order?.ticket.price * 100}
        email={currentUser?.email}
      />
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;

  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
