import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { ReviewDocument } from 'src/review/review.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>, // User 모델 주입
    @InjectModel('Review') private reviewModel: Model<ReviewDocument> // Review 모델 주입
  ) {}
  async findUserById(userId: string): Promise<UserDocument | null> {
    return await this.userModel.findById(userId).lean().exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email }).lean().exec();
  }

  async findUserOne(where: any): Promise<UserDocument | null> {
    return await this.userModel.findOne(where).lean().exec();
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    const user = new this.userModel(createUserDto);
    return await user.save();
  }

  async createUserForKakao(email: string): Promise<UserDocument> {
    const newUser = new this.userModel({ email });
    return await newUser.save();
  }

  async updateByEmail(email: string, updateUserDto: UpdateUserDto): Promise<UserDocument | null> {
    return await this.userModel.findOneAndUpdate({ email }, updateUserDto,{ new: true }).populate('tag_img').lean().exec();
  }

  async patchByEmail(email: string): Promise<UserDocument | null> {
    const currentDate = new Date();
    return await this.userModel.findOneAndUpdate({ email }, { $set: { deleted_at: currentDate } }, { new: true, lean: true }).exec();
  }

  async getUserIdByReviewId(reviewId: string): Promise<string | null> {
    const review = await this.reviewModel.findById(reviewId).exec();
    return review && review.user_id ? review.user_id.toString() : null;
  }
  

  async incrementComplaintById(userId: string): Promise<UserDocument | null> {
    return await this.userModel.findByIdAndUpdate(userId, { $inc: { complaint: 1 } }, { new: true, lean: true }).exec();
  }

  async allUsers(): Promise<UserDocument[]> {
    return await this.userModel.find({}).lean().exec();
  }

  async deleteById(id: string): Promise<UserDocument | null> {
    return await this.userModel.findOneAndDelete({ _id: id }).exec();
  }
}
