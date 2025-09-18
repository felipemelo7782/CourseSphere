// front/src/types/User.ts

export interface User {
  id: number|string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: 'admin' | 'instructor' | 'student';
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'instructor' | 'student';
  avatar?: string;
}