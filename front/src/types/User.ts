// front/src/types/User.ts

export interface User {
  id: number;
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