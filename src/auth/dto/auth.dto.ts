import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@IsEmail()
	email: string

	@MinLength(6, { message: 'At least 6 numbers' })
	@IsString()
	password: string
}
