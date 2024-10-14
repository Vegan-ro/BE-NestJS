import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReportedPlaceDocument } from './report.schema';

@Injectable()
export class ReportedPlaceRepository {
  constructor(
    @InjectModel('ReportedPlace')
    private readonly ReportedPlaceModel: Model<ReportedPlaceDocument>,
  ) {}

  // 새로운 장소 제보
  async createReportedPlace({
    user_id,
    category,
    category_img,
    ...restOfData
  }) {
    const newReportedPlace = new this.ReportedPlaceModel({
      user_id,
      category,
      category_img,
      ...restOfData,
    });
    await newReportedPlace.save();
    return newReportedPlace.toObject();
  }
  // id로 제보된 장소 찾기
  async findReportedPlaceById(id: string) {
    return await this.ReportedPlaceModel.findById(id)
      .populate('category_img')
      .lean();
  }
  // 조건을 만족하는 제보된 장소 모두 찾기
  async findReportedPlaces(
    pageNumber: number,
    pageSize: number,
    user_id: string,
  ) {
    let query: any = {};

    if (user_id) {
      query.user_id = user_id;
    }

    let reportedPlaces: any;
    // 조건이 없다면 전체 데이터 가져오기
    if (Object.keys(query).length === 0) {
      reportedPlaces = await this.ReportedPlaceModel.find()
        .sort({ createdAt: -1 })
        .populate('category_img')
        .populate({ path: 'user_id', select: '-is_admin -password' })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .exec();
    } else {
      reportedPlaces = await this.ReportedPlaceModel.find(query)
        .sort({ createdAt: -1 })
        .populate('category_img')
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .exec();
    }
    return reportedPlaces;
  }
  // 특정 id를 가진 제보 장소 내용 덮어씌우기
  async updateReportedPlace(
    id: string,
    { user_id, category, category_img, ...restOfData },
  ) {
    const updatedReportedPlace =
      await this.ReportedPlaceModel.findByIdAndUpdate(
        id,
        {
          category,
          category_img,
          ...restOfData,
          user_id,
        },
        { new: true },
      )
        .populate(['category_img', 'user_id'])
        .lean();
    return updatedReportedPlace;
  }
  // 특정 id를 가진 제보 장소 삭제
  async deleteReportedPlace(id: string) {
    const deletedReportedPlace =
      await this.ReportedPlaceModel.findByIdAndDelete(id)
        .populate(['category_img', 'user_id'])
        .lean();
    return deletedReportedPlace;
  }
}
