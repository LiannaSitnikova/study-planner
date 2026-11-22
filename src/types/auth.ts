export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse extends User {
  accessToken: string;
  refreshToken: string;
}