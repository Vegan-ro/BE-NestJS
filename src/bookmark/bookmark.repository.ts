import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BookmarkDocument, BookmarkSchema }  from "./bookmark.schema";
import { Model } from 'mongoose';
import { CreateBookmarkDto } from "./dto/create.bookmark.dto";
import { Types } from 'mongoose';

@Injectable()
export class BookmarkRepository {
    constructor(@InjectModel('Bookmark') private readonly bookmarkModel: Model<BookmarkDocument>) {}

      // 북마크 전체 조회 (유저)
    async getBookmarksByUserId(userId: string, pageNumber: number, pageSize: number) {
      const bookmarks = await this.bookmarkModel
        .find({ user_id: userId })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .populate({
          path: 'place_id',
          populate: {
            path: 'category_img',
            model: 'Image',
          },
        })
        .exec();
      return bookmarks;
    }
    // 북마크 추가 (유저)
    async createBookmark(userId: string, placeId: string): Promise<BookmarkDocument> {
      // 직접 ObjectId로 변환
      const userObjectId = new Types.ObjectId(userId);
      const placeObjectId = new Types.ObjectId(placeId);
  
      // 새로운 북마크 생성
      const newBookmark = await this.bookmarkModel.create({
        user_id: userObjectId,
        place_id: placeObjectId,
      });
  
      return newBookmark.toObject();
    }
  
  // 북마크 추가시 중복 불가
    async getBookmarkByUserIdAndPlaceId(userId: string, placeId: string) {
      const userObjectId = new Types.ObjectId(userId);
      const placeObjectId = new Types.ObjectId(placeId);
      const bookmark = await this.bookmarkModel.findOne({
        user_id: userObjectId,
        place_id: placeObjectId, });
      return bookmark ? bookmark._id.toString() : null;
    }
  
  // 북마크 삭제 (유저)
    async deleteBookmark(id: string) {
      const deletedBookmark = await this.bookmarkModel.findOneAndDelete({ _id: id });
      return deletedBookmark;
    }
  
  // 북마크 많은 순으로 정렬(장소)
    async getMostBookmarkedPlaces() {
      const mostBookmarkedPlaces = await this.bookmarkModel.aggregate([
        {
          $group: {
            _id: '$place_id',
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
        {
          $lookup: {
            from: 'places',
            localField: '_id',
            foreignField: '_id',
            as: 'place_info',
          },
        },
      ]);
      return mostBookmarkedPlaces;
    }
  }