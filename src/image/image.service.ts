import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ImageRepository } from './image.repository';
import { UpdateImageDto } from './dto/update.image.dto';

@Injectable()
export class ImageService {
  constructor(private readonly imageRepository: ImageRepository) {}

  async createImage({ name, url }) {
    const newImage = await this.imageRepository.createImage({ name, url });
    if (!newImage) {
      throw new BadRequestException('이미지 등록에 실패하였습니다.');
    }
    return { message: '정상적으로 등록되었습니다.', newImage };
  }

  async updateImage(imageId: string, updateImageDto: UpdateImageDto): Promise<any> {
    const updatedImage = await this.imageRepository.updateImage(imageId, updateImageDto);
    if (!updatedImage) {
      throw new NotFoundException('해당 id를 갖는 이미지가 없습니다.');
    }
    return { message: '정상적으로 수정되었습니다.', updatedImage };
  }
  
  async deleteImage(id) {
    const deletedImage = await this.imageRepository.deleteImage(id);
    if (!deletedImage) {
      throw new NotFoundException('해당 이미지가 존재하지 않습니다');
    }
    return { message: '이미지가 성공적으로 삭제되었습니다.', deletedImage };
  }

  async getImages() {
    const images = await this.imageRepository.getImages();
    if (!images.length) {
      throw new NotFoundException('이미지가 존재하지 않습니다');
    }
    return images;
  }

  async getImageById(id) {
    const imageInfo = await this.imageRepository.getImageById(id);
    if (!imageInfo) {
      throw new NotFoundException('이미지를 찾을 수 없습니다.');
    }
    return imageInfo;
  }

  async getImageByName(name) {
    const imageInfo = await this.imageRepository.getImageByName(name);
    if (!imageInfo) {
      throw new NotFoundException('해당 이미지가 존재하지 않습니다');
    }
    return imageInfo;
  }
}
