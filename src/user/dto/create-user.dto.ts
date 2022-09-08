import { IsEmail, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
	@IsString()
	firstName: string

	@IsString()
	lastName: string

	@IsEmail()
	email: string

	@MinLength(6, { message: 'At least 6 numbers' })
	@IsString()
	password: string

	@MinLength(6, { message: 'At least 8 numbers' })
	@IsString()
	phone: string
}
