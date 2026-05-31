import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

@Controller('upload')
export class UploadController {

  @Post('course-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/course-images',
        filename: (req, file, cb) => {
          const unique =
            Date.now() + '-' + file.originalname;

          cb(null, unique);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      imageUrl:
        `http://localhost:3000/uploads/course-images/${file.filename}`,
    };
  }
}