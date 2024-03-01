import { PrismaGymRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CheckinUseCase } from '../check-in'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-checkins-repository'

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymRepository()
  const useCase = new CheckinUseCase(checkInsRepository, gymsRepository)

  return useCase
}
