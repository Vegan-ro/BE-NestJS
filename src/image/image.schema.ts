import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose";
import * as mongoosePaginate from 'mongoose-paginate-v2';

// 새로운 우리만의 타입 -Image 스키마 문서 타입 /
export type ImageDocument = ImageSchema & Document;

@Schema({
  timestamps:{createdAt: 'created_at',updatedAt: 'updated_at',},
  versionKey: false,
})
export class ImageSchema {
    @Prop({ required: true, unique: true, })
    name: string;

    @Prop({ required: true,
      type: {
        basic_url: { type: String, required: true },
        pin_url: { type: String },
        _id: false 
      },
    })
    url: { basic_url: string; pin_url?: string };
  }


const schema = SchemaFactory.createForClass(ImageSchema);
schema.plugin(mongoosePaginate);

export const imageSchema = schema;
