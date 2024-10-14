import { BadRequestException, Injectable } from '@nestjs/common';
import { ReportedPlaceRepository } from './report.repository';
import { ImageRepository } from 'src/image/image.repository';
import { CreateReportedPlaceDto } from './dto/create.reported.place.dto';

@Injectable()
export class ReportedPlaceService {
  constructor(
    private readonly reportedPlaceRepository: ReportedPlaceRepository,
    private readonly imageRepository: ImageRepository,
  ) {}

  // 새로운 장소 등록
  async createReportedPlace(
    createReportedPlaceDto: CreateReportedPlaceDto,
    user_id: string,
  ) {
    const { category, ...restOfData } = createReportedPlaceDto;
    // category_img 이미지 컬렉션에서 가져오기
    const category_img = await this.imageRepository.getImageByName(category);
    const newReportedPlace =
      await this.reportedPlaceRepository.createReportedPlace({
        user_id,
        category,
        category_img,
        ...restOfData,
      });
    if (newReportedPlace === null) {
      throw new BadRequestException('제보 장소 등록에 실패하였습니다.');
    }
    return { message: '정상적으로 등록되었습니다.', newReportedPlace };
  }

  // 특정 id를 가진 장소 가져오기
  async getReportedPlace(id: string) {
    const reportedPlace =
      await this.reportedPlaceRepository.findReportedPlaceById(id);
    if (reportedPlace === null) {
      throw new BadRequestException('해당 id를 갖는 제보가 없습니다.');
    }
    return reportedPlace;
  }

  // 조건을 만족하는 장소 모두 가져오기
  async getReportedPlaces(
    pageNumber: number,
    pageSize: number,
    user_id?: string,
  ) {
    const reportedPlaces =
      await this.reportedPlaceRepository.findReportedPlaces(
        pageNumber,
        pageSize,
        user_id,
      );
    return reportedPlaces;
  }

  // 특정 id를 가진 장소 내용 수정
  async updateReportedPlace(id: string, { updateReportedPlaceDto, user_id }) {
    const { category, ...restOfData } = updateReportedPlaceDto;
    // category_img 이미지 컬렉션에서 가져오기
    const category_img = await this.imageRepository.getImageByName(category);
    const updatedReportedPlace =
      await this.reportedPlaceRepository.updateReportedPlace(id, {
        category,
        category_img,
        ...restOfData,
        user_id,
      });
    if (updatedReportedPlace === null) {
      throw new BadRequestException('해당 id를 갖는 제보가 없습니다.');
    }
    return { message: '정상적으로 수정되었습니다.', updatedReportedPlace };
  }

  // 특정 id를 가진 장소 삭제
  async deleteReportedPlace(id: string) {
    const deletedReportedPlace =
      await this.reportedPlaceRepository.deleteReportedPlace(id);
    if (deletedReportedPlace === null) {
      throw new BadRequestException('해당 id를 갖는 제보가 없습니다.');
    }
    return { message: '정상적으로 삭제되었습니다.', deletedReportedPlace };
  }
}
