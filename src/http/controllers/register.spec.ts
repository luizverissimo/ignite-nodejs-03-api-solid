import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Resgister (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
