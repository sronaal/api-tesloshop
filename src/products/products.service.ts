import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDTO } from 'src/common/dto/pagination-dto';

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

  findAll(paginationDTO: PaginationDTO) {
    const { limit = 10, offset = 0} = paginationDTO


    return this.productRepository.find({
      take: limit,
      skip: offset
    })
  }

  async findOne(id: string) {
    
    let product = await this.productRepository.findOneBy({id})

    if(!product) throw new NotFoundException(`product with id ${id} not found`)

    return product
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    
    const product = await this.findOne(id)
    await this.productRepository.remove(product)
    return {
      "message": "Producto eliminado",
      id
    }
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
