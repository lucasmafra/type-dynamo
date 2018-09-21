export const timeout = (time: number) => setTimeout(
  () => new Promise((resolve, reject) => {
    resolve()
  }), time)
