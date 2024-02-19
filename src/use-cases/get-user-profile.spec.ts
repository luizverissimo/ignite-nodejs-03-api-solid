import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let userRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile UseCase', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(userRepository)
  })
  it('should be able to get user profile', async () => {
    const createdUser = await userRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('Jhon Doe')
  })

  it('should not be able to get user profile with wrong id', async () => {
    expect(async () => {
      await sut.execute({
        userId: 'non-exists-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
