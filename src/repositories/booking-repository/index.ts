import { Booking, Room } from '@prisma/client';
import { prisma } from '@/config';

async function checkUserHaveBooking(userId: number): Promise<Booking> {
  return prisma.booking.findFirst({
    where: { userId: userId },
  });
}

async function getRoomById(roomId: number): Promise<Room> {
  return prisma.room.findFirst({
    where: { id: roomId },
  });
}

async function countBookingsByRoom(roomId: number): Promise<Booking[]> {
  return prisma.booking.findMany({
    where: { roomId },
  });
}

async function createBooking(roomId: number, userId: number): Promise<Booking> {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

async function updateBooking(bookingId: number, roomId: number): Promise<Booking> {
  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      roomId,
    },
  });
}

async function checkBooking(bookingId: number) {
  return prisma.booking.findFirst({
    where: { id: bookingId },
  });
}

async function getUserBooking(userId: number, bookingId: number): Promise<Booking> {
  return prisma.booking.findFirst({ where: { userId, id: bookingId } });
}

export default {
  checkUserHaveBooking,
  getRoomById,
  countBookingsByRoom,
  createBooking,
  updateBooking,
  checkBooking,
  getUserBooking,
};
