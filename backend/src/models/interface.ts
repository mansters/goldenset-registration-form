export interface UserDto {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface DbUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  created_at: Date;
}
