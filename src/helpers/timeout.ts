import { ITimeout } from '../types'

export class Timeout implements ITimeout {
  public async wait(time: number) {
    setTimeout(
      () => new Promise((resolve) => {
        resolve()
    }), time)
  }
}
