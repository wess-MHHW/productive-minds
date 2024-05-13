export function formatTask(object: Object) {
  let keys = ['title', 'description', 'category', 'tags', 'done', 'date'];
  let result: any = {};
  for (let [key, value] of Object.entries(object)) {
    if (keys.includes(key)) {
      if (key === 'category') {
        result['category'] = value.title;
      } else if (key === 'tags') {
        result['tags'] = value.map((tag: any) => tag.title);
      } else if (key === 'date') {
        result['date'] = new Date(value).toISOString();
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}
