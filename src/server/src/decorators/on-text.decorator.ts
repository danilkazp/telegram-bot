import 'reflect-metadata'

const callMethodName = 'onText'
const OnText = (matchText: string | RegExp) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const metaData = {
      callMethod: callMethodName,
      matchText,
    }
    Reflect.defineMetadata('metaData', metaData, descriptor.value)
  }
}

export default OnText
