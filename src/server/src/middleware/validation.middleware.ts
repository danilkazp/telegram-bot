import { plainToClass } from 'class-transformer'
import { ValidationError, validate } from 'class-validator'
import { RequestHandler } from 'express'

import HttpException from 'src/exceptions/HttpException'

function validationMiddleware<T>(
  type: any,
  skipMissingProperties = false,
): RequestHandler {
  return (req, res, next) => {
    validate(plainToClass(type, req.body), { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) => Object.values(error.constraints))
            .join(', ')
          next(new HttpException(400, message))
        } else {
          next()
        }
      },
    )
  }
}

export default validationMiddleware
