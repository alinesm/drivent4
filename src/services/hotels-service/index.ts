import { Hotel, TicketStatus } from '@prisma/client';
import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import hotelsRepository from '@/repositories/hotels-repository';
import { paymentRequiredError } from '@/errors/payment-required-error';

async function validateUserData(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.status !== TicketStatus.PAID || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel)
    throw paymentRequiredError();
}

async function getHotels(userId: number): Promise<Hotel[]> {
  await validateUserData(userId);

  const hotels: Hotel[] = await hotelsRepository.getHotels();
  if (hotels.length < 1) throw notFoundError();
  return hotels;
}

async function getHotelById(hotelId: number, userId: number): Promise<Hotel> {
  await validateUserData(userId);

  const hotel = await hotelsRepository.getHotelById(hotelId);
  if (!hotel) throw notFoundError();

  return hotel;
}

export default {
  validateUserData,
  getHotels,
  getHotelById,
};
