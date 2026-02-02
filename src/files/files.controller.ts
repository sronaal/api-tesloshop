import { BadRequestException, Body, Controller, Get, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer} from './helpers/';
import { diskStorage } from 'multer';



@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }


  @Post('product')
  @UseInterceptors( FileInterceptor('file',{
    fileFilter: fileFilter,
    //limits: { fileSize: 100},
    storage: diskStorage({ 
      destination: './static/products',
      filename: fileNamer
    })
  }) )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ){

    if(!file) { throw new BadRequestException('File is empty')}

    return file
  }
}
