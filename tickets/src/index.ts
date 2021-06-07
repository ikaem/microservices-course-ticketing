import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('No hash secret present');
  if (!process.env.MONGO_URI) throw new Error('No database URI present');

  try {
    await natsWrapper.connect(
      'ticketing',
      'someserviceid',
      'http://nats-srv:4222'
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

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
