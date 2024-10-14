import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose";
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { ImageDocument } from "src/image/image.schema";

// 새로운 우리만의 타입 -User 스키마 문서 타입 /
export type UserDocument = UserSchema & Document;

@Schema({
  timestamps:{createdAt: 'created_at',updatedAt: 'updated_at',},
  versionKey: false,
})
export class UserSchema {
    @Prop({required: true})
    email: string;

    @Prop({default: null,})
    password: string;

    @Prop({default: null,})
    name: string;

    @Prop({default: null })
    nickname: string;

    @Prop({default: null,})
    phone: string;

    @Prop({default: null,})
    tag: string;

    @Prop({
      type: Types.ObjectId,
      ref: 'Image',
      default: null,
    })
    tag_img: Types.ObjectId |ImageDocument;

    @Prop({required: true, default: 0,})
    complaint: number;

    @Prop({default: false,})
    is_admin: boolean;

    @Prop({default: null,})
    deleted_at: Date;
  }

const schema = SchemaFactory.createForClass(UserSchema);
schema.plugin(mongoosePaginate);

export const userSchema = schema;
