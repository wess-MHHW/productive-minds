import { Task } from '../../interfaces/task';
import { User } from '../../interfaces/user';
import { getWeekInterval } from './get-week';
import { isDateIn } from './is-date-in';

export function updateUser(
  user: User,
  oldTask: Task | null,
  newTask: Task | null
) {
  // CREATE
  if (!oldTask && newTask) {
    // UPDATE USER CATEGORIES
    user.categories = user.categories?.map((category) => {
      if (category.title === newTask.category.title) {
        category.count = category.count + 1;
      }

      return category;
    });

    // UPDATE USER TAGS
    const newTaskTitles = newTask.tags?.map((tag) => tag.title);
    user.tags = user.tags?.map((tag) => {
      if (newTaskTitles?.includes(tag.title)) {
        tag.count = tag.count + 1;
      }

      return tag;
    });

    // UPDATE USER TODAY UPCOMING
    if (isDateIn(new Date(newTask.date), new Date())) {
      user.today = user.today! + 1;
      user.upcoming = user.upcoming! + 1;
    } else {
      let interval = getWeekInterval();
      if (
        new Date(newTask.date) >= interval[0] &&
        new Date(newTask.date) < interval[1]
      ) {
        user.upcoming = user.upcoming! + 1;
      }
    }

    return user;
  }

  // DELETE
  if (oldTask && !newTask) {
    // UPDATE USER CATEGORIES
    user.categories = user.categories?.map((category) => {
      if (category.title === oldTask.category.title) {
        category.count = category.count - 1;
      }

      return category;
    });

    // UPDATE USER TAGS
    const oldTaskTitles = oldTask.tags?.map((tag) => tag.title);
    user.tags = user.tags?.map((tag) => {
      if (oldTaskTitles?.includes(tag.title)) {
        tag.count = tag.count - 1;
      }

      return tag;
    });

    // UPDATE USER TODAY UPCOMING
    if (isDateIn(new Date(oldTask.date), new Date())) {
      user.today = user.today! - 1;
      user.upcoming = user.upcoming! - 1;
    } else {
      let interval = getWeekInterval();
      if (
        new Date(oldTask.date) >= interval[0] &&
        new Date(oldTask.date) < interval[1]
      ) {
        user.upcoming = user.upcoming! - 1;
      }
    }

    return user;
  }

  // EDIT
  if (oldTask && newTask) {
    // UPDATE USER CATEGORIES
    user.categories = user.categories?.map((category) => {
      if (category.title === oldTask.category.title) {
        category.count = category.count - 1;
      }
      if (category.title === newTask.category.title) {
        category.count = category.count + 1;
      }

      return category;
    });

    // UPDATE USER TAGS
    const newTaskTitles = newTask.tags?.map((tag) => tag.title);
    const oldTaskTitles = oldTask.tags?.map((tag) => tag.title);
    user.tags = user.tags?.map((tag) => {
      if (oldTaskTitles?.includes(tag.title)) {
        tag.count = tag.count - 1;
      }
      if (newTaskTitles?.includes(tag.title)) {
        tag.count = tag.count + 1;
      }

      return tag;
    });

    // UPDATE USER TODAY UPCOMING
    if (!isDateIn(new Date(oldTask.date), new Date(newTask.date))) {
      if (
        isDateIn(new Date(oldTask.date), new Date()) ||
        isDateIn(new Date(newTask.date), new Date())
      ) {
        if (isDateIn(new Date(oldTask.date), new Date())) {
          user.today = user.today! - 1;
        } else {
          user.today = user.today! + 1;
        }
      }
    }

    let interval = getWeekInterval();
    if (
      !(
        new Date(oldTask.date) >= interval[0] &&
        new Date(oldTask.date) < interval[1] &&
        new Date(newTask.date) >= interval[0] &&
        new Date(newTask.date) < interval[1]
      )
    ) {
      if (
        new Date(oldTask.date) >= interval[0] &&
        new Date(oldTask.date) < interval[1] &&
        (new Date(newTask.date) < interval[0] ||
          new Date(newTask.date) >= interval[1])
      ) {
        user.upcoming = user.upcoming! - 1;
      } else if (
        new Date(newTask.date) >= interval[0] &&
        new Date(newTask.date) < interval[1] &&
        (new Date(oldTask.date) < interval[0] ||
          new Date(oldTask.date) >= interval[1])
      ) {
        user.upcoming = user.upcoming! + 1;
      }
    }

    return user;
  }

  return user;

  /* user.categories = user.categories?.map((category) => {
    if (oldTask && category.title === oldTask.category.title) {
      category.count = category.count - 1;
    }
    if (newTask && category.title === newTask.category.title) {
      category.count = category.count + 1;
    }

    return category;
  });

  user.tags = user.tags?.map((tag) => {
    if (oldTask) {
      const oldTaskTitles = oldTask.tags?.map((tag) => tag.title);
      if (oldTaskTitles?.includes(tag.title)) {
        tag.count = tag.count - 1;
      }
    }
    if (newTask) {
      const newaskTitles = newTask.tags?.map((tag) => tag.title);
      if (newaskTitles?.includes(tag.title)) {
        tag.count = tag.count + 1;
      }
    }

    return tag;
  });

  let interval = getWeekInterval();
  if (oldTask && newTask) {
    if (isDateIn(new Date(oldTask.date), new Date(newTask.date))) {
    } else {
      if (isDateIn(new Date(oldTask.date), new Date())) {
        user.today = user.today! - 1;
      }
      if (
        !isDateIn(new Date(oldTask.date), new Date()) &&
        isDateIn(new Date(newTask.date), new Date())
      ) {
        user.today = user.today! + 1;
      }
    }
    if (
      new Date(oldTask.date) >= interval[0] &&
      new Date(oldTask.date) < interval[1] &&
      new Date(newTask.date) >= interval[0] &&
      new Date(newTask.date) < interval[1]
    ) {
    } else if (
      new Date(oldTask.date) >= interval[0] &&
      new Date(oldTask.date) < interval[1] &&
      new Date(newTask.date) < interval[0] &&
      new Date(newTask.date) >= interval[1]
    ) {
      user.upcoming = user.upcoming! - 1;
    } else {
      user.upcoming = user.upcoming! + 1;
    }
  } else if (!oldTask && newTask) {
    if (isDateIn(new Date(), new Date(newTask.date))) {
      user.today = user.today! + 1;
      user.upcoming = user.upcoming! + 1;
    } else if (
      new Date(newTask.date) >= interval[0] &&
      new Date(newTask.date) < interval[1]
    ) {
      user.upcoming = user.upcoming! + 1;
    }
  } else if (oldTask && !newTask) {
    if (isDateIn(new Date(), new Date(oldTask.date))) {
      user.today = user.today! - 1;
      user.upcoming = user.upcoming! - 1;
    } else if (
      new Date(oldTask.date) >= interval[0] &&
      new Date(oldTask.date) < interval[1]
    ) {
      user.upcoming = user.upcoming! - 1;
    }
  }

  return user; */
}
