import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '../user/entities/user.entity'
import { Repository } from 'typeorm'
import { UserService } from '../user/user.service'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { compare, genSalt, hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	async register(dto: CreateUserDto) {
		const salt = await genSalt(10)

		const user = await this.userService.create({
			firstName: dto.firstName,
			lastName: dto.lastName,
			email: dto.email,
			password: await hash(dto.password, salt),
			phone: dto.phone
		})

		return {
			user: this.returnUserFields(user),
			accessToken: await this.getAccessToken(user.id)
		}
	}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)

		return {
			user: this.returnUserFields(user),
			accessToken: await this.getAccessToken(user.id)
		}
	}

	//HELPERS
	async validateUser(dto: AuthDto) {
		const user = await this.userRepository.findOne({
			where: {
				email: dto.email
			},
			select: ['id', 'email', 'password']
		})

		if (!user) throw new NotFoundException('User did not found')

		const isValidPassword = await compare(dto.password, user.password)
		if (!isValidPassword) throw new UnauthorizedException('Incorrect password')

		return user
	}

	async getAccessToken(userId) {
		const data = {
			id: userId
		}
		return await this.jwtService.signAsync(data)
	}

	returnUserFields(user: UserEntity) {
		return {
			id: user.id,
			email: user.email
		}
	}
}
