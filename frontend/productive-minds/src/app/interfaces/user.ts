import { Category } from './category';
import { Tag } from './tag';

export interface User {
  id?: string;
  name: string;
  email: string;
  occupation: string;
  password?: string;
  categories?: Array<Category>;
  tags?: Array<Tag>;
  token?: string;
  today?: number;
  upcoming?: number;
}
