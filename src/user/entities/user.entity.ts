import { Base } from '../../utils/dto/base'
import { Column, Entity } from 'typeorm'

@Entity('User')
export class UserEntity extends Base {
	@Column({ name: 'first_name' })
	firstName: string

	@Column({ name: 'last_name' })
	lastName: string

	@Column({ unique: true })
	email: string

	@Column({ select: false })
	password: string

	@Column()
	phone: string
}
