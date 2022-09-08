import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from './entities/user.entity'
import { genSalt, hash } from 'bcryptjs'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {}

	async create(dto: CreateUserDto) {
		const oldUser = await this.userRepository.findOneBy({ email: dto.email })
		if (oldUser) throw new BadRequestException('Choose another email')

		return await this.userRepository.save(dto)
	}

	async findAll() {
		return await this.userRepository.find()
	}

	async findOne(id: number) {
		const user = await this.userRepository.findOne({
			where: {
				id
			},
			order: {
				createdAt: 'DESC'
			}
		})

		if (!user) throw new NotFoundException('User did not found')

		return user
	}

	async update(id: number, dto: UpdateUserDto) {
		const user = await this.findOne(id)

		if (dto.password) {
			const salt = await genSalt(10)
			user.password = await hash(dto.password, salt)
		}

		user.email = dto.email
		user.firstName = dto.firstName
		user.lastName = dto.lastName
		user.phone = dto.phone

		return this.userRepository.save(user)
	}

	remove(id: number) {
		return `This action removes a #${id} user`
	}
}
