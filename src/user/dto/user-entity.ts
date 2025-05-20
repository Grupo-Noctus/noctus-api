import { Role } from "@prisma/client";

export interface UserEntity {
  id: number;
  username: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  phoneNumber: string;
  image: string;
  active: boolean;
}
