const Orders = ({ orders }) => {
  return (
    <div>
      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            {o.ticket.title} - {o.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

Orders.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/orders');

  return { orders: data };
};

export default Orders;
