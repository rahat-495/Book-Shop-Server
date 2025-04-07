/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { Server } from 'http';

let server: Server;
const main = async () => {
  try {
    await mongoose
      .connect(config.databaseUrl as string)
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
      });

    server = app.listen(config.port, () => {
      console.log(`server are running at port ${config.port} !`);
    });
  } catch (error) {
    console.log(error);
  }
};

main();
