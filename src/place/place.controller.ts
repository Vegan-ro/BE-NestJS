import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create.place.dto';
import { ResponseFormat } from 'src/global/response.format';
import { PlaceFilterDto } from './dto/place.filter.dto';

@Controller()
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  // 새로운 장소 등록 POST
  @Post('/admin/places')
  async createPlace(
    @Body() createPlaceDto: CreatePlaceDto,
  ): Promise<ResponseFormat> {
    const newPlace = await this.placeService.createPlace(createPlaceDto);
    return new ResponseFormat(newPlace);
  }

  // 특정 장소 GET
  @Get('/places/:placeId')
  async getPlace(@Param('placeId') placeId: string): Promise<ResponseFormat> {
    const place = await this.placeService.getPlace(placeId);
    return new ResponseFormat(place);
  }

  // getPlaces 공통 함수
  async getPlaces({
    pageNumber,
    pageSize,
    search,
    ...restOfData
  }: PlaceFilterDto) {
    let query: any = {};
    if (search) {
      query.search = search;
    }
    let places: any;
    if (Object.keys(query).length === 0) {
      const { center, radius, category, veganOption } = restOfData;
      places = await this.placeService.getPlaces(
        pageNumber,
        pageSize,
        center,
        radius,
        category,
        veganOption,
      );
    } else {
      places = await this.placeService.getPlacesByKeyword(
        pageNumber,
        pageSize,
        query.search,
      );
    }
    return new ResponseFormat(places);
  }

  // 장소 필터링 GET
  @Get('/places')
  async getPlacesWithFilter(
    @Query() filterDto: PlaceFilterDto,
  ): Promise<ResponseFormat> {
    return await this.getPlaces(filterDto);
  }

  // 장소 전체 조회 GET
  @Get('/admin/places')
  async getPlacesUseAdmin(
    @Query() filterDto: PlaceFilterDto,
  ): Promise<ResponseFormat> {
    return await this.getPlaces(filterDto);
  }

  // 장소 수정 PUT
  @Put('/admin/places/:placeId')
  async updatePlace(
    @Param('placeId') placeId: string,
    @Body() updatePlaceDto: CreatePlaceDto,
  ): Promise<ResponseFormat> {
    const updatedPlace = await this.placeService.updatePlace(
      placeId,
      updatePlaceDto,
    );
    return new ResponseFormat(updatedPlace);
  }

  // 장소 삭제 DELETE
  @Delete('/admin/places/:placeId')
  async deletePlace(
    @Param('placeId') placeId: string,
  ): Promise<ResponseFormat> {
    const deletedplace = await this.placeService.deletePlace(placeId);
    return new ResponseFormat(deletedplace);
  }

  // 장소 삭제 여부 PATCH
  @Patch('/admin/places/:placeId')
  async updateDeletedAt(
    @Param('placeId') placeId: string,
  ): Promise<ResponseFormat> {
    const updatedPlace = await this.placeService.updateDeletedAt(placeId);
    return new ResponseFormat(updatedPlace);
  }
}
