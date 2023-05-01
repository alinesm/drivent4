import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    const userBooking = await bookingService.getBooking(userId);
    return res.status(httpStatus.OK).send(userBooking);
  } catch (error) {
    next(error);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const roomId = parseInt(req.body.roomId);

  try {
    const { id } = await bookingService.createBooking(userId, roomId);
    res.sendStatus(httpStatus.OK).send({ bookingId: id });
  } catch (error) {
    next(error);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const roomId = parseInt(req.body.roomId);
  const bookingId = parseInt(req.params.bookingId);

  try {
    const { id } = await bookingService.updateBooking(userId, roomId, bookingId);
    res.sendStatus(httpStatus.OK).send({ bookingId: id });
  } catch (error) {
    next(error);
  }
}
