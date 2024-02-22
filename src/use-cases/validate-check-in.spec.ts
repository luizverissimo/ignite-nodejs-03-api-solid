import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckinUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckinUseCase

describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckinUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate check-in', async () => {
    // vi.setSystemTime(new Date(2024, 0, 17, 8, 0, 0))
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate inexistent check-in', async () => {
    // vi.setSystemTime(new Date(2024, 0, 17, 8, 0, 0))
    expect(async () => {
      await sut.execute({
        checkInId: 'inexistent-check-in-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2024, 1, 22, 13, 40))

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const TWENTYONEMINUTESINMILISECONDS = 1000 * 60 * 21
    vi.advanceTimersByTime(TWENTYONEMINUTESINMILISECONDS)

    expect(async () => {
      await sut.execute({
        checkInId: createdCheckIn.id,
      })
    }).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
