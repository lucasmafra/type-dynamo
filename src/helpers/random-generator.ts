import { IRandomGenerator } from '../types'

export class RandomGenerator implements IRandomGenerator {
  public generateRandomString() {
    return Math.random().toString(36).slice(2)
  }
}
