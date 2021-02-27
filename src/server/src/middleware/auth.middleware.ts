import { NextFunction, Response } from 'express'
import * as jwt from 'jsonwebtoken'

import AuthenticationTokenMissingException from 'src/exceptions/AuthenticationTokenMissingException'
import WrongAuthenticationTokenException from 'src/exceptions/WrongAuthenticationTokenException'
import RequestWithUser from 'src/interfaces/requestWithUser.interface'
import TokenDataInterface from 'src/interfaces/tokenData.interface.ts'
import userModel from 'src/modules/user/user.model'

async function authMiddleware(
  request: RequestWithUser,
  response: Response,
  next: NextFunction,
) {
  const cookies = request.cookies
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET
    try {
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret,
      ) as TokenDataInterface
      const id = verificationResponse._id
      const user = await userModel.findById(id)
      if (user) {
        request.user = user
        next()
      } else {
        next(new WrongAuthenticationTokenException())
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException())
    }
  } else {
    next(new AuthenticationTokenMissingException())
  }
}

export default authMiddleware
