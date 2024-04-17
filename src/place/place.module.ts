import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { placeSchema } from './place.schema';
import { PlaceRepository } from './place.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Place', schema: placeSchema }]),
  ],
  controllers: [PlaceController],
  providers: [PlaceService, PlaceRepository],
})
export class PlaceModule {}
