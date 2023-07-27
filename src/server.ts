import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config({ path: './config.env' });
//set env config before importing app.
import app from './app';

const DB = process.env.DATABASE!.replace('<password>', process.env.DATABASE_PASSWORD || '');

// const connectOptions: CustomMongoClientOptions = {
//   // useNewUrlParser: true,
//   // useCreateIndex: true,
//   // useFindAndModify: false,
// };

mongoose
  .connect(DB, {})
  .then(() => {
    // console.log('connections', connection.connections);
    console.log(DB);
    console.log('DB Connected  ');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
