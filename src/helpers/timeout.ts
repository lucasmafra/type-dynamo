export class Timeout {
  public async wait(time: number): Promise<void> {
    setTimeout(
      () => new Promise((resolve) => {
        resolve()
      }), time)
  }
}
