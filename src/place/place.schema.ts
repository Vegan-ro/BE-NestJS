import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { ImageDocument } from 'src/image/image.schema';

export type PlaceDocument = PlaceSchema & Document;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})
export class PlaceSchema {
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
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: string; // 'Point'
    coordinates: [number, number]; // [경도, 위도]
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
}

const schema = SchemaFactory.createForClass(PlaceSchema);
schema.plugin(mongoosePaginate);
schema.index({ location: '2dsphere' });

export const placeSchema = schema;
