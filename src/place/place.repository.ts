import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlaceDocument } from './place.schema';

@Injectable()
export class PlaceRepository {
  constructor(
    @InjectModel('Place') private readonly placeModel: Model<PlaceDocument>,
  ) {}

  // 새로운 장소 추가
  async createPlace({
    category,
    category_img,
    location: newLocation,
    ...restOfData
  }) {
    const newPlace = new this.placeModel({
      category,
      category_img,
      location: newLocation,
      ...restOfData,
    });
    await newPlace.save();
    return newPlace.toObject();
  }

  // id로 장소 찾기
  async findPlaceById(id: String) {
    // deleted_at이 null인 데이터만 가져오기
    return await this.placeModel
      .findOne({ _id: id, deleted_at: { $eq: null } })
      .populate('category_img')
      .lean();
  }

  // 장소이름 또는 주소에 검색어를 포함하는 장소 모두 찾기
  async findPlacesByKeyword(
    pageNumber?: number,
    pageSize?: number,
    search?: string,
  ) {
    return await this.placeModel
      .find({
        $and: [
          {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { address: { $regex: search, $options: 'i' } },
              { address_lot_number: { $regex: search, $options: 'i' } },
              { address_detail: { $regex: search, $options: 'i' } },
            ],
          },
          { deleted_at: { $eq: null } }, // deleted_at이 null인 데이터만 포함
        ],
      })
      .populate('category_img')
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();
  }

  // 조건을 만족하는 장소 모두 찾기
  async findPlaces(
    center?: string,
    radius?: number,
    pageNumber?: number,
    pageSize?: number,
    category?: string,
    veganOption?: boolean,
  ) {
    let query: any = { deleted_at: null }; // deleted_at이 null인 데이터만 포함

    if (center && radius) {
      const centerArray = center.split(',').map(Number);
      const radiusInMeters = radius * 1000; // 킬로미터를 미터로 변환
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: centerArray,
          },
          $maxDistance: radiusInMeters,
        },
      };
    }

    if (category) {
      query.category = category;
    }

    if (veganOption) {
      query.vegan_option = veganOption;
    }

    let places = await this.placeModel
      .find(query)
      .populate('category_img')
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();
    return places;
  }

  // 특정 id를 가진 장소 내용 덮어씌우기
  async updatePlace(id: string, { category, category_img, ...restOfData }) {
    const updatedPlace = await this.placeModel
      .findByIdAndUpdate(
        id,
        {
          category,
          category_img,
          ...restOfData,
        },
        { new: true },
      )
      .populate('category_img')
      .lean();
    return updatedPlace;
  }

  // 특정 id를 가진 장소 삭제
  async deletePlace(id: string) {
    const deletedPlace = await this.placeModel
      .findByIdAndDelete(id)
      .populate('category_img')
      .lean();
    return deletedPlace;
  }

  // 특정 id를 가진 장소 삭제 표시
  async updateDeletedAt(id: string) {
    const updatedPlace = await this.placeModel.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true },
    );
    return updatedPlace;
  }
}
