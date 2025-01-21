import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsBufferSizeValid(maxSizeInMB: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBufferSizeValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Handle both Buffer instances and Buffer-like objects
          let buffer: Buffer;
          
          if (Buffer.isBuffer(value)) {
            buffer = value;
          } else if (value && value.type === 'Buffer' && Array.isArray(value.data)) {
            buffer = Buffer.from(value.data);
          } else {
            console.log('Invalid value type:', typeof value, value);
            return false;
          }
          
          const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
          const actualSizeInBytes = buffer.length;
          
          console.log('File size:', actualSizeInBytes, 'bytes');
          console.log('Max size:', maxSizeInBytes, 'bytes');
          
          return actualSizeInBytes <= maxSizeInBytes;
        },
        defaultMessage(args: ValidationArguments) {
          const value = args.value;
          let sizeInMB = 'unknown';
          
          if (Buffer.isBuffer(value)) {
            sizeInMB = (value.length / (1024 * 1024)).toFixed(2);
          } else if (value && value.type === 'Buffer' && Array.isArray(value.data)) {
            sizeInMB = (value.data.length / (1024 * 1024)).toFixed(2);
          }
          
          return `File size (${sizeInMB}MB) must be less than ${maxSizeInMB}MB`;
        },
      },
    });
  };
}