import { User as DatabaseUser } from '@prisma/client';

export type SafeUser = Omit<DatabaseUser, 'hashedPassword' | 'createdAt' | 'updatedAt'>;
