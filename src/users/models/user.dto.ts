import { User as DbUser } from '@prisma/client';

export type UserDto = Omit<DbUser, 'hashedPassword'>;
