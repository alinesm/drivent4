import faker from '@faker-js/faker';
import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

export async function createHotel(): Promise<Hotel> {
  return prisma.hotel.create({
    data: { name: faker.company.companyName(), image: faker.image.imageUrl() },
  });
}

export async function createRoom(hotelId: number): Promise<Room> {
  return prisma.room.create({
    data: { name: faker.name.findName(), capacity: faker.datatype.number(), hotelId },
  });
}

export async function createRoomTotalCapacity(hotelId: number, limit: number) {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: limit,
      hotelId,
    },
  });
}
