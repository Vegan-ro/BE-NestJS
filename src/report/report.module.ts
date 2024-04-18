import { Module } from '@nestjs/common';
import { ReportedPlaceService } from './report.service';
import { ReportedPlaceController } from './report.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { reportedPlaceSchema } from './report.schema';
import { ReportedPlaceRepository } from './report.repository';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ReportedPlace', schema: reportedPlaceSchema },
    ]),
    ImageModule,
  ],
  controllers: [ReportedPlaceController],
  providers: [ReportedPlaceService, ReportedPlaceRepository],
})
export class ReportedPlaceModule {}
