import { UserRole } from 'src/shared';
import { UserService } from 'src/apps/user/user.service';
import { INestApplicationContext } from '@nestjs/common';

async function adminUserSeed(userService: UserService) {
  // Check if admin user already exists
  const existingAdmin = await userService.findOneByEmail(
    'admin@petresearch.com',
  );

  if (existingAdmin) {
    console.log('Admin user already exists, skipping seed...');
    return;
  }

  await userService.register(
    {
      id: '',
      role: UserRole.ADMINISTRATOR,
      cityIds: [],
    },
    {
      cityIds: [],
      email: 'renan.ricoldi.frois@gmail.com',
      name: 'Renan Ricoldi',
      role: UserRole.ADMINISTRATOR,
    },
  );

  console.log('Admin user created successfully!');
  console.log('Email: renan.ricoldi.frois@gmail.com');
}

export default async function runSeeds(app: INestApplicationContext) {
  try {
    console.log('Running seeds...');

    // Run admin user seed
    await adminUserSeed(app.get(UserService));

    console.log('All seeds completed successfully!');
  } catch (error) {
    console.error('Error running seeds:', error);
  } finally {
    await app.close();
  }
}
