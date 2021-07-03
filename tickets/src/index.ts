import mongoose from 'mongoose';

import { app } from './app';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('No hash secret present');
  if (!process.env.MONGO_URI) throw new Error('No database URI present');
  if (!process.env.NATS_CLIENT_ID) throw new Error('No NATS CLIENT ID present');
  if (!process.env.NATS_URL) throw new Error('No NATS URL present');
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error('No NATS_CLUSTER_ID present');

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (e) {
    console.log(e);
  }

  app.listen(3000, () => console.log('Listening on port 3000'));
};

start();
