import { Request } from 'express';
import { User } from '../../user/entities/user.entity';

export interface AuthenticatedRequest extends Request {
  user: User;
}
