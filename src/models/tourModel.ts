import mongoose, { Schema, Model } from 'mongoose';
import slugify from 'slugify';
import validator from 'validator';
export interface Tour {
  name: string;
  slug: string;
  duration: string;
  maxGroupSize: number;
  difficulty: 'easy' | 'medium' | 'difficult';
  price: number;
  priceDiscount?: number;
  ratingsAverage?: number;
  ratingQuantity?: number;
  summary: string;
  description: string;
  imageCover: string;
  images?: string[];
  createsAt?: Date;
  startDates?: Date[];
  secretTour?: boolean;
}

const tourSchema = new Schema<Tour>(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must have less or equal then 40 caracters'],
      minLength: [10, 'A tour name must have more or equal then 40 caracters'],
      // validate: [validator.isAlpha, 'Tour name should only contain characters'],
    },
    slug: { type: String },
    duration: { type: String, required: [true, 'A tour must have a duration'] },
    maxGroupSize: { type: Number, required: [true, 'A tour must have a group size'] },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: { values: ['easy', 'medium', 'difficult'], message: 'Difficulty is either: easy medium, difficult' },
    },

    price: { type: Number, required: [true, 'A tour must have a price'] },
    priceDiscount: {
      type: Number,
      // validate: {
      //   validator: function (val: number) {
      //     // this validator only works on the current doc while creating not while updating
      //     return val < this.price;
      //   },
      //   message: 'Discount price should be below regular price',
      // },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be greater than 1.0'],
      max: [5, 'Rating must be less than 5.0'],
    },
    ratingQuantity: { type: Number, default: 0 },
    summary: { type: String, required: [true, 'A tour must have a summary'], trim: true },
    description: { type: String, required: [true, 'A tour must have a description'], trim: true },
    imageCover: { type: String, required: [true, 'A tour must have a cover image'] },
    images: { type: [String] },
    createsAt: { type: Date, default: Date.now(), select: false },
    startDates: { type: [Date] },
    secretTour: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema.virtual('durationWeeks').get(function () {
  return Number(this.duration) / 7;
});
//Document Middleware or pre-save hook: Runs before.save() and .create()
// tourSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });
//Document Middleware or post-save hook: Runs after.save() and .create()
// tourSchema.post('save', function (doc, next) {
//   console.log('doc', doc);
//   next();
// });

//Query Middleware or find hook
// tourSchema.pre(/^find/, function (next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });
//Aggregation Middleware or aggregate hook pre or post

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});
const TourModel = mongoose.model('Tour', tourSchema);

export default TourModel;
