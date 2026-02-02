import { BadRequestException, Body, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers/';
import { diskStorage } from 'multer';
import { type Response } from 'express';



@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }


  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    //limits: { fileSize: 100},
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ) {

    if (!file) { throw new BadRequestException('File is empty') }

    console.log(file)
    const secureURL = `${file.filename}`

    return file
  }

  @Get('product/:imageName')
  findOneImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticProductImage(imageName)
    
    res.sendFile(path);
  }
}
