import 'reflect-metadata'

const callMethodName = 'onText'
const OnText = (matchText: string | RegExp) => {
  console.log('###-this', this)
  
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const metaData = {
      callMethod: callMethodName,
      matchText,
    }
    Reflect.defineMetadata('metaData', metaData, descriptor.value)
  }
}

export default OnText
