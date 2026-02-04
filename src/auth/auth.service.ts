import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async create(createAuthDto: CreateUserDTO) {
    
    try {
      const create = this.userRepository.create(createAuthDto)
      await this.userRepository.save(create)
      return create
    }
     catch (error) {
      this.handleDBError(error)
      
    }

  }


  private handleDBError(error: any): never {
    if( error.code === '23505' ){
      throw new BadRequestException(error.detail)
    }
    console.log(error)
    throw new InternalServerErrorException('Check Server Logs')
  }

  
}
