export function formatResponse(
  user: any,
  token: string,
  today?: number,
  upcoming?: number
) {
  user['token'] = token;
  user['today'] = today;
  user['upcoming'] = upcoming;
  return user;
}
