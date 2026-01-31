import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDTO } from 'src/common/dto/pagination-dto';
import { validate as IsUUID } from 'uuid'
import { ProductImage, Product } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepositoty: Repository<ProductImage>

  ) { }

  async create(createProductDto: CreateProductDto) {
    let product = new Product()

    try {

      const { images = [], ...productDetails } = createProductDto
      // Crea una instacia de tipo producto
      product = this.productRepository.create({
        ...productDetails,
        images: images.map( image =>  this.productImageRepositoty.create({url: image}))

      })

      // Grabar en la base de datos
      await this.productRepository.save(product)

      return {...product, images}
    } catch (error) {

      this.handleExeptions(error)

    }


  }

  async findAll(paginationDTO: PaginationDTO) {
    const { limit = 10, offset = 0 } = paginationDTO


    const products =  await  this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    })

    return products.map( product => ( {
      ...product, 
      images: product.images?.map( img => img.url)
    }))
  }

  async findOne(term: string) {

    let product: Product | null

    if (IsUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term })
    } else {
      product = await this.productRepository
        .createQueryBuilder('product')
        .where('product.title = :term OR product.slug = :term', { term })
        .getOne()
    }

    if (!product) {
      throw new NotFoundException(`product with id ${term} not found`)
    }

    return product
  }


  async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
      images: []
    })

    if (!product) throw new NotFoundException(`Product with id ${id} not found`)

    await this.productRepository.save(product)
    return product
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
