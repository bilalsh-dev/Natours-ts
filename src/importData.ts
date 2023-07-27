// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import fs from 'fs';
// import Tour from './models/tourModel';
// dotenv.config({ path: './config.env' });
// //set env config before importing app.

// const DB = process.env.DATABASE!.replace('<password>', process.env.DATABASE_PASSWORD || '');

// mongoose
//   .connect(DB, {})
//   .then(() => {
//     console.log(DB);
//     console.log('DB Connected  ');
//   })
//   .catch((err) => {
//     console.error('Error connecting to MongoDB', err);
//   });
// // console.log('__dirname', __dirname);
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));
// // console.log('tours', tours);

// const importData = async () => {
//   try {
//     await Tour.create(tours);
//     console.log('data loaded succesfully');
//     process.exit();
//   } catch (error) {
//     console.log('error', error);
//   }
// };

// // const deleteData = async () => {
// //   try {
// //     await Tour.deleteMany();
// //     console.log('data deleted succesfully');
// //     process.exit();
// //   } catch (error) {
// //     console.log('error', error);
// //   }
// // };
// // deleteData();
// importData();
// console.log(process.argv);
