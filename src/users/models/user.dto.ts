import { User as DatabaseUser } from '@prisma/client';

export type UserDto = Omit<DatabaseUser, 'hashedPassword'>;
