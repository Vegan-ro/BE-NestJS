import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ImageService } from "./image.service";
import { CreateImageDto } from "./dto/create.image.dto";
import { UpdateImageDto } from "./dto/update.image.dto";
import { ResponseFormat } from 'src/global/response.format';
import { Roles } from "src/auth/roles.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { RoleGuard } from "src/auth/role.guard";

@Controller('admin')
export class ImageController {constructor(
    private readonly imageService: ImageService,
) {}

// 이미지 추가
@Post()
@Roles('admin')
  @UseGuards(AuthGuard,RoleGuard)
async postImage(@Body() CreateImageDto:CreateImageDto) {
  const newImage = await this.imageService.createImage(CreateImageDto);
  return  new ResponseFormat(newImage);
}

// 이미지 수정
@Put('images/:imageId')
@Roles('admin')
  @UseGuards(AuthGuard,RoleGuard)
async putImage(@Param('imageId') imageId: string, @Body() updateImageDto: UpdateImageDto) {
  const updatedImage = await this.imageService.updateImage(imageId, updateImageDto);
  return  new ResponseFormat(updatedImage);
}


// 이미지 삭제
@Delete('images/:imageId')
@Roles('admin')
  @UseGuards(AuthGuard,RoleGuard)
async deleteImage(@Param('imageId') imageId: string) {
  const deletedImage = await this.imageService.deleteImage(imageId);
  return  new ResponseFormat(deletedImage);
}

// 이미지 전체 조회(이름 쿼리)
@Get('images')
@Roles('admin')
  @UseGuards(AuthGuard,RoleGuard)
async getImages(@Query('name') name?: string) {
  let images;
  if (name) {
    images = await this.imageService.getImageByName(name);
  } else {
    images = await this.imageService.getImages();
  }
  return  new ResponseFormat(images);
}

// 이미지 id로 조회
@Get('images/:imageId')
@Roles('admin')
  @UseGuards(AuthGuard,RoleGuard)
async getImageById(@Param('imageId') imageId: string) {
  const imageInfo = await this.imageService.getImageById(imageId);
  return new ResponseFormat(imageInfo);
}
}