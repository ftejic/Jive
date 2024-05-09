interface User {
  _id: string;
  email: string;
  username: string;
  image: string;
}

export const getSender = (
  loggedUser: User | null | undefined,
  users: User[]
) => {
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};
