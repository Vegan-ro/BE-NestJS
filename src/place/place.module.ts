import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { placeSchema } from './place.schema';
import { PlaceRepository } from './place.repository';
import { ImageModule } from 'src/image/image.module';
import { RoleGuard } from 'src/auth/role.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Place', schema: placeSchema }]),
    ImageModule,
  ],
  controllers: [PlaceController],
  providers: [PlaceService, PlaceRepository, RoleGuard],
  exports: [PlaceRepository],
})
export class PlaceModule {}
