import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export function formatValidationError(validationErrors: ValidationError[] = []): BadRequestException {
  const errors: string[] = validationErrors
    .map((error) => {
      const recursiveConstraints = (err: ValidationError): string[] => {
        if (err.children && err.children.length > 0) {
          return err.children.flatMap((child) => recursiveConstraints(child));
        }
        return Object.values(err.constraints || {});
      };
      return recursiveConstraints(error);
    })
    .flat();

  return new BadRequestException(errors);
}
