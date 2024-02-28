import { Environment } from 'vitest'

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  setup() {
    console.log('Setup')

    return {
      teardown() {
        console.log('teardown')
      },
    }
  },
}
