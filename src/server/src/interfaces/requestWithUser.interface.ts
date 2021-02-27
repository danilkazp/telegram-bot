import { Request } from 'express'

import User from 'src/modules/user/user.interface'

interface RequestWithUser extends Request {
  user: User
}

export default RequestWithUser
