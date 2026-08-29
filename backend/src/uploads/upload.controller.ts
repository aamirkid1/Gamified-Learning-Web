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
    const baseUrl =
      process.env.BASE_URL || 'http://localhost:3000';

    return {
      imageUrl:
        `${baseUrl}/uploads/course-images/${file.filename}`,
    };
  }
}