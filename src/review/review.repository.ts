import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewModule } from './review.module';
import { CreateReviewDto } from './dto/create.review.dto';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectModel('Review')
    private readonly ReviewModel: Model<ReviewModule>,
  ) {}

  // 새로운 리뷰 추가
  async createReview(createReviewDto: CreateReviewDto, user_id: string) {
    const newReview = new this.ReviewModel({
      createReviewDto,
      user_id,
    });
    await newReview.save();
    return newReview.toObject();
  }

  // id로 리뷰 찾기
  async findReviewById(id: string) {
    return await this.ReviewModel.findById(id).populate('user_id').lean();
  }

  // 조건을 만족하는 리뷰 모두 찾기
  async findReviews(
    pageNumber: number,
    pageSize: number,
    userId: string,
    placeId: string,
  ) {
    let query: any = {};

    if (placeId) {
      query.place_id = placeId;
    }

    // user_id와 place_id가 둘 다 있는 경우 user_id는 리뷰 작성자 확인을 위한 것
    if (userId && !query.place_id) {
      query.user_id = userId;
    }

    let reviews: any;
    // 조건이 없다면 전체 데이터 가져오기
    if (Object.keys(query).length === 0) {
      reviews = await this.ReviewModel.find()
        .sort({ createdAt: -1 })
        .populate({ path: 'place_id', select: '_id name address' })
        .populate({ path: 'user_id', select: '_id nickname tag' })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .exec();
    } else {
      reviews = await this.ReviewModel.find(query)
        .sort({ createdAt: -1 })
        .populate({ path: 'place_id', select: '_id name address' })
        .populate({ path: 'user_id', select: '_id nickname tag' })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .exec();
    }

    // 조건에 맞는 데이터의 총 개수(페이지네이션X)
    const totalCount = await this.ReviewModel.countDocuments(query);

    // 각 리뷰의 user_id와 현재 userId 비교하여 currentUser 필드 추가
    if (userId && placeId) {
      reviews = reviews.map((review) => {
        // user_id 필드에 populate를 적용했기 때문에 user_id의 _id로 비교
        const reviewUserId = review.user_id._id.toString();
        return {
          // ...review.toObject(),
          reviewId: review._id,
          CurrentUser: reviewUserId === userId,
        };
      });
    }

    return { reviews, totalCount };
  }

  // 특정 id를 가진 리뷰 내용 덮어씌우기
  async updateReview(id: string, content: string) {
    const updatedReview = await this.ReviewModel.findByIdAndUpdate(
      id,
      {
        content,
      },
      { new: true },
    ).lean();
    return updatedReview;
  }

  // 특정 id를 가진 리뷰 삭제
  async deleteReview(id: string) {
    const deletedReview = await this.ReviewModel.findByIdAndDelete(id).lean();
    return deletedReview;
  }
}
