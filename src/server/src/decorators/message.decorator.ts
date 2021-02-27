import 'reflect-metadata'

const Message = (matchMessage: string | RegExp) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const metaData = {
      matchMessage,
    }
    Reflect.defineMetadata('metaData', metaData, descriptor.value)
  }
}

export default Message
