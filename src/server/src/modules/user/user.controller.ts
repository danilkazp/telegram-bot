import { NextFunction, Request, Response, Router } from 'express'

import NotAuthorizedException from 'src/exceptions/NotAuthorizedException'
import UserNotFoundException from 'src/exceptions/UserNotFoundException'
import Controller from 'src/interfaces/controller.interface'
import RequestWithUser from 'src/interfaces/requestWithUser.interface'
import authMiddleware from 'src/middleware/auth.middleware'
import postModel from 'src/modules/post/post.model'
import userModel from 'src/modules/user.model'

class UserController implements Controller {
  public path = '/users'
  public router = Router()
  private post = postModel
  private user = userModel

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, authMiddleware, this.getUserById)
    this.router.get(
      `${this.path}/:id/posts`,
      authMiddleware,
      this.getAllPostsOfUser,
    )
  }

  private getUserById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = request.params.id
    const userQuery = this.user.findById(id)
    if (request.query.withPosts === 'true') {
      userQuery.populate('posts').exec()
    }
    const user = await userQuery
    if (user) {
      response.send(user)
    } else {
      next(new UserNotFoundException(id))
    }
  }

  private getAllPostsOfUser = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction,
  ) => {
    const userId = request.params.id
    if (userId === request.user._id.toString()) {
      const posts = await this.post.find({ author: userId })
      response.send(posts)
    }
    next(new NotAuthorizedException())
  }
}

export default UserController
