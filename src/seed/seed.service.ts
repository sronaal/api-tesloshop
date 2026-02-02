import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';


@Injectable()
export class SeedService {

  constructor(
    
    private readonly productService: ProductsService
    
   
  ){}
  
  async runSeed(){
    await this.insertNewProducts()
    return `execute seed`
  }

  private  async insertNewProducts(){
    await this.productService.deleteAllProducts()
  }
}
