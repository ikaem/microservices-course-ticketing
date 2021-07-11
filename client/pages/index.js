// client\pages\index.js

import Link from 'next/link';
// import { buildClient } from '../api/build-client';

const LandingPage = ({ currentUser, tickets }) => {
  console.log({ tickets });

  const ticketList = tickets.map((t) => {
    return (
      <tr key={t.id}>
        <td>{t.title}</td>
        <td>{t.price}</td>
        <td>
          <Link href={'/tickets/[ticketId]'} as={`/tickets/${t.id}`}>
            <a>{'-->'}</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  // const { data } = await buildClient(context).get('/api/users/currentuser');
  // console.log({ data });
  // return data;
  // return {};

  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default LandingPage;
