import { BadRequestException, Injectable } from '@nestjs/common';
import { PlaceRepository } from './place.repository';
import { ImageRepository } from 'src/image/image.repository';
import { CreatePlaceDto } from './dto/create.place.dto';

@Injectable()
export class PlaceService {
  constructor(
    private readonly placeRepository: PlaceRepository,
    private readonly imageRepository: ImageRepository,
  ) {}

  // 새로운 장소 등록
  async createPlace(createPlaceDto: CreatePlaceDto) {
    const { category, location, ...restOfData } = createPlaceDto;
    // category_img 이미지 컬렉션에서 가져오기
    const category_img = await this.imageRepository.getImageByName(category);
    // location GeoJSON 객체로 저장
    const newLocation = {
      type: 'Point',
      coordinates: location,
    };
    const newPlace = await this.placeRepository.createPlace({
      category,
      category_img,
      location: newLocation,
      ...restOfData,
    });
    if (newPlace === null) {
      throw new BadRequestException('장소 등록에 실패하였습니다.');
    }
    return { message: '정상적으로 등록되었습니다.', newPlace };
  }

  // 특정 id를 가진 장소 가져오기
  async getPlace(placeId: string) {
    const place = await this.placeRepository.findPlaceById(placeId);
    if (place === null) {
      throw new BadRequestException('해당 id를 갖는 장소가 없습니다.');
    }
    return place;
  }

  // 검색어를 만족하는 장소 모두 가져오기
  async getPlacesByKeyword(
    pageNumber?: number,
    pageSize?: number,
    search?: string,
  ) {
    const places = await this.placeRepository.findPlacesByKeyword(
      pageNumber,
      pageSize,
      search,
    );
    return places;
  }
  // 조건을 만족하는 장소 모두 가져오기
  async getPlaces(
    pageNumber?: number,
    pageSize?: number,
    center?: string,
    radius?: number,
    category?: string,
    veganOption?: boolean,
  ) {
    if ((center && !radius) || (!center && radius)) {
      throw new BadRequestException(
        '거리 검색을 위해서는 center와 radius 모두 필요합니다',
      );
    }

    const places = await this.placeRepository.findPlaces(
      center,
      radius,
      pageNumber,
      pageSize,
      category,
      veganOption,
    );
    return places;
  }
  // 특정 id를 가진 장소 내용 수정
  async updatePlace(id: string, updatePlaceDto: CreatePlaceDto) {
    // id가 deleted_at이 null이고, 존재하는 id인지 확인
    const existingPlace = await this.placeRepository.findPlaceById(id);
    if (!existingPlace) {
      throw new BadRequestException('해당 id를 갖는 장소가 없습니다.');
    }
    const { category, ...restOfData } = updatePlaceDto;
    // category_img 이미지 컬렉션에서 가져오기
    const category_img = await this.imageRepository.getImageByName(category);
    const updatedPlace = await this.placeRepository.updatePlace(id, {
      category,
      category_img,
      ...restOfData,
    });
    return { message: '정상적으로 수정되었습니다.', updatedPlace };
  }

  // 특정 id를 가진 장소 삭제
  async deletePlace(id: string) {
    const deletedPlace = await this.placeRepository.deletePlace(id);
    if (!deletedPlace) {
      throw new BadRequestException('해당 id를 갖는 장소가 없습니다.');
    }
    return { message: '정상적으로 삭제되었습니다.', deletedPlace };
  }

  // 특정 id를 가진 장소 삭제 날짜 표시
  async updateDeletedAt(id: string) {
    const updatedPlace = await this.placeRepository.updateDeletedAt(id);
    if (updatedPlace === null) {
      throw new BadRequestException('해당 id를 갖는 장소가 없습니다.');
    }
    return { message: '정상적으로 삭제되었습니다.', updatedPlace };
  }
}
