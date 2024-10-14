import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose";
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { PlaceDocument } from "src/place/place.schema";
import { UserDocument } from "src/user/user.schema";

// 새로운 우리만의 타입 -User 스키마 문서 타입 /
export type BookmarkDocument = BookmarkSchema & Document;

@Schema({
  timestamps:{createdAt: 'created_at',updatedAt: 'updated_at',},
  versionKey: false,
})
export class BookmarkSchema {
    @Prop({
      type: Types.ObjectId,
      ref: 'Place',
      default: null,
    })
    place_id: Types.ObjectId | PlaceDocument;

    @Prop({
      type: Types.ObjectId,
      ref: 'User',
      default: null,
    })
    user_id: Types.ObjectId | UserDocument;

    
  }

const schema = SchemaFactory.createForClass(BookmarkSchema);
schema.plugin(mongoosePaginate);

export const bookmarkSchema = schema;
