import express, { Router } from 'express';
import * as tourController from './../controllers/tourController';

const tourRouter: Router = express.Router();
// tourRouter.param('id', tourController.checkId);
tourRouter.route('/top-5-cheap').get(tourController.aliasTopTour, tourController.getAllTours);
tourRouter.route('/tour-stats').get(tourController.getTourStats);
tourRouter.route('/').get(tourController.getAllTours).post(tourController.createTour);
tourRouter.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
tourRouter.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

export default tourRouter;
