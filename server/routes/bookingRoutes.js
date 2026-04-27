import express from 'express';
import { createBooking, getOcuupiedSeats } from '../controllers/bookingControler.js';

const bookingRouter = express.Router()

bookingRouter.post('/create', createBooking)
bookingRouter.get('/seats/:showId', getOcuupiedSeats)

export default bookingRouter

