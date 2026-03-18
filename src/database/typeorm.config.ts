import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { Gift } from './entities/gift.entity';
import { User } from './entities/user.entity';

const databasePort = Number(process.env.DB_PORT ?? 5432);

const sharedOptions = {
    type: 'postgres' as const,
    host: process.env.DB_HOST ?? 'localhost',
    port: Number.isNaN(databasePort) ? 5432 : databasePort,
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'password',
    database: process.env.DB_DATABASE ?? 'gifts',
    entities: [User, Gift],
    synchronize: false,
};

export const typeOrmOptions: TypeOrmModuleOptions = {
    ...sharedOptions,
};

export const dataSourceOptions: DataSourceOptions = {
    ...sharedOptions,
    migrations: [
        __filename.endsWith('.ts')
            ? 'src/database/migrations/*.ts'
            : 'dist/database/migrations/*.js',
    ],
};
