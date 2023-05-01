import { Booking, Room, TicketStatus } from '@prisma/client';
import { forbiddenError, notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function validateUserData(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.status !== TicketStatus.PAID || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel)
    throw forbiddenError();
}

async function getBooking(userId: number): Promise<{
  id: number;
  Room: Room;
}> {
  await validateUserData(userId);

  const userBooking = await bookingRepository.checkUserHaveBooking(userId);
  if (!userBooking) throw notFoundError();

  const room = await bookingRepository.getRoomById(userBooking.roomId);

  return { id: userBooking.id, Room: room };
}

async function createBooking(userId: number, roomId: number): Promise<Booking> {
  await validateUserData(userId);

  const roomExists = await bookingRepository.getRoomById(roomId);
  if (!roomExists) throw notFoundError();

  const countBookingsByRoom = await bookingRepository.countBookingsByRoom(roomId);

  if (roomExists.capacity <= countBookingsByRoom.length) throw forbiddenError();

  const booking = await bookingRepository.createBooking(roomId, userId);

  return booking;
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  await validateUserData(userId);

  const booking = await bookingRepository.getUserBooking(userId, bookingId);
  if (!booking) throw forbiddenError();

  const roomExists = await bookingRepository.getRoomById(roomId);
  if (!roomExists) throw notFoundError();

  const countBookingsByRoom = await bookingRepository.countBookingsByRoom(roomId);

  if (roomExists.capacity <= countBookingsByRoom.length) throw forbiddenError();

  const updatedBooking = await bookingRepository.updateBooking(bookingId, roomId);

  return updatedBooking;
}

export default {
  getBooking,
  createBooking,
  updateBooking,
};
