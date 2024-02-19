import { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-errors'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'

interface CheckinUseCaseRequest {
  email: string
  password: string
}
interface CheckinUseCaseResponse {
  user: User
}

export class CheckinUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
