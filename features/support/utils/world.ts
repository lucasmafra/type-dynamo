import { setWorldConstructor } from 'cucumber'

class CustomWorld {
  public result = undefined

  public set(value: any) { this.result = value }
}

setWorldConstructor(CustomWorld)
