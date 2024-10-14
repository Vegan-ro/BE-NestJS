import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImageDocument } from './image.schema';
import { CreateImageDto } from './dto/create.image.dto';
import { UpdateImageDto } from './dto/update.image.dto';

@Injectable()
export class ImageRepository {
  constructor(@InjectModel('Image') private readonly imageModel: Model<ImageDocument>) {}

// 이미지 추가
  async createImage(createImageDto: CreateImageDto): Promise<ImageDocument> {
    const { name, url } = createImageDto;
    const newImage = new this.imageModel({ name, url });
    await newImage.save();
    return newImage.toObject();
  }

// 이미지 수정
async updateImage(id: string, updateImageDto: UpdateImageDto): Promise<ImageDocument> {
  const { name, url } = updateImageDto;
  return await this.imageModel.findByIdAndUpdate(id, { name, url }, { new: true });
}


// 이미지 삭제
  async deleteImage(id: string): Promise<ImageDocument> {
    return await this.imageModel.findByIdAndDelete(id).lean();
  }

// 전체 이미지 조회
  async getImages(): Promise<ImageDocument[]> {
    return await this.imageModel.find({}).lean();
  }

//이미지 id로 조회
  async getImageById(id: string): Promise<ImageDocument> {
    return await this.imageModel.findById(id).lean();
  }

//이름으로 이미지 조회
  async getImageByName(name: string): Promise<ImageDocument> {
    return await this.imageModel.findOne({ name }).lean();
  }
}
