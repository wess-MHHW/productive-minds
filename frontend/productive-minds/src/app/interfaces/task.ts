import { Category } from './category';
import { Tag } from './tag';

export interface Task {
  _id?: string;
  title: string;
  description?: string;
  done: boolean;
  date: Date;
  category: Category;
  tags: Array<Tag>;
  publisher?: string;
}
