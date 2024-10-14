import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { ImageDocument } from 'src/image/image.schema';
import { UserDocument } from 'src/user/user.schema';

export type ReportedPlaceDocument = ReportedPlaceSchema & Document;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})
export class ReportedPlaceSchema {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  category: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Image',
    required: true,
  })
  category_img: Types.ObjectId | ImageDocument;

  @Prop({
    required: true,
  })
  vegan_option: boolean;

  @Prop({
    default: '',
  })
  tel: string;

  @Prop({
    required: true,
  })
  address: string;

  @Prop({
    required: true,
  })
  address_lot_number: string;

  @Prop({
    default: '',
  })
  address_detail: string;

  @Prop({
    type: [Number],
    required: true,
  })
  location: {
    type: number[];
  };

  @Prop({
    type: [String],
    default: [],
  })
  open_times: string[];

  @Prop({
    type: [String],
    default: [],
  })
  sns_url: string[];

  @Prop({
    type: Date,
    default: null,
  })
  deleted_at: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user_id: Types.ObjectId | UserDocument;
}

const schema = SchemaFactory.createForClass(ReportedPlaceSchema);
schema.plugin(mongoosePaginate);

export const reportedPlaceSchema = schema;
