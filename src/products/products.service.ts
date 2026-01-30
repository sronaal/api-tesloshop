import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) { }

  async create(createProductDto: CreateProductDto) {
    const product = new Product()

    try {

      // Crea una instacia de tipo producto
      const product = this.productRepository.create(createProductDto)

      // Grabar en la base de datos
      await this.productRepository.save(product)

      return product
    } catch (error) {

      this.handleExeptions(error)

    }


  }

  findAll() {
    return this.productRepository.find({})
  }

  async findOne(id: string) {
    
    let product = await this.productRepository.findOneBy({id})

    if(!product) throw new NotFoundException(`product with id ${id} not found`)

    return product
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  private handleExeptions(error: any) {
    if (error.code === '23505') {
      this.logger.error(error.detail)
      throw new BadRequestException(error.detail)
    }

    this.logger.error(error.detail)
    throw new InternalServerErrorException('Error Server, Check Server Logs')
  }
}
