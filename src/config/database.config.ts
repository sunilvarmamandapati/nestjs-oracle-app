import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'oracle',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 1521,
    serviceName: process.env.DB_SERVICE_NAME || 'ORCL',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    entities: [User],
    synchronize: false,
    logging: process.env.NODE_ENV !== 'production',
    extra: {
      poolMin: parseInt(process.env.DB_POOL_MIN, 10) || 2,
      poolMax: parseInt(process.env.DB_POOL_MAX, 10) || 10,
    },
  }),
);
