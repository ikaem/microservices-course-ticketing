// auth\src\index.ts
import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
  console.log('starting up');
  if (!process.env.JWT_KEY) throw new Error('No hash secret present');
  if (!process.env.MONGO_URI) throw new Error('No database URI present');

  try {
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
