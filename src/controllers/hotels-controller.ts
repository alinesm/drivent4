import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    const hotels = await hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    next(error);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const hotelId = parseInt(req.params.hotelId);

  try {
    const hotel = await hotelsService.getHotelById(hotelId, userId);

    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    next(error);
  }
}
