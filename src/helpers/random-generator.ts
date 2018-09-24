export class RandomGenerator {
  public generateRandomString() {
    return Math.random().toString(36).slice(2)
  }
}
