const users = new Map();

const setUsername = (username, user) => {
  users.set(username, user);
  console.log(users);
};

const getUsername = (username) => {
  return users.get(username);
};

export { setUsername, getUsername };
