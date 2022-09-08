import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'

export const getTypeOrmConfig = async (
	configService: ConfigService
): Promise<TypeOrmModuleOptions> => ({
	type: 'postgres',
	host: 'localhost',
	port: configService.get('TYPEORM_PORT'),
	username: configService.get<string>('TYPEORM_USERNAME'),
	password: configService.get('TYPEORM_PASSWORD'),
	database: configService.get('TYPEORM_DATABASE'),
	autoLoadEntities: true,
	synchronize: true
})
