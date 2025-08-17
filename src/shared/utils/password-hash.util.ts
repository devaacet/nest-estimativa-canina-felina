import * as bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const salt = bcrypt.genSaltSync(12);
  return bcrypt.hash(password, salt);
}

export async function comparePasswordAndHash(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
