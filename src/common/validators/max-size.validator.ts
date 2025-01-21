import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

function getBase64FileSize(base64String: string): number {
  try {
    const base64Data = base64String.split(';base64,').pop() || '';
    
    // Calculate size in bytes (1 base64 character represents 6 bits, so 4 base64 characters = 3 bytes)
    const padding = base64Data.slice(-2).split('=').length - 1;
    const sizeInBytes = (base64Data.length * 3) / 4 - padding;
    
    return sizeInBytes / (1024 * 1024);
  } catch (error) {
    console.error('Error calculating base64 file size:', error);
    return -1;
  }
}

export function MaxFileSize(maxSizeInMB: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'maxFileSize',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [maxSizeInMB],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          try {
            if (typeof value !== 'string' || !value.includes(';base64,')) {
              console.error('Invalid base64 string format');
              return false;
            }

            const fileSizeInMB = getBase64FileSize(value);
            const [maxSize] = args.constraints;

            console.log({
              fileSizeInMB,
              maxSizeInMB: maxSize,
              passes: fileSizeInMB <= maxSize
            });

            return fileSizeInMB <= maxSize;
          } catch (error) {
            console.error('File size validation error:', error);
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          const [maxSize] = args.constraints;
          const currentSize = getBase64FileSize(args.value);
          return `File size must not exceed ${maxSize}MB (current size: ${currentSize.toFixed(2)}MB)`;
        }
      }
    });
  };
}