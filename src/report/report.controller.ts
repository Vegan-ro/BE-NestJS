import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  Req,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReportedPlaceService } from './report.service';
import { ResponseFormat } from 'src/global/response.format';
import { CreateReportedPlaceDto } from './dto/create.reported.place.dto';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';

@Controller()
export class ReportedPlaceController {
  constructor(private readonly reportedPlaceService: ReportedPlaceService) {}

  // id로 특정 제보 장소 GET
  @Get('/reports/:reportedPlaceId')
  @Roles('user')
  @UseGuards(AuthGuard, RoleGuard)
  async getReportedPlace(
    @Param('reportedPlaceId') reportedPlaceId: string,
  ): Promise<ResponseFormat> {
    const reportedPlace =
      await this.reportedPlaceService.getReportedPlace(reportedPlaceId);
    return new ResponseFormat(reportedPlace);
  }

  // 제보 장소 전체 GET
  @Get('/admin/reports')
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  async getReportedPlaces(
    @Query('pageNumber') pageNumber: number,
    @Query('pageSize') pageSize: number,
  ): Promise<ResponseFormat> {
    const reportedPlaces = await this.reportedPlaceService.getReportedPlaces(
      pageNumber,
      pageSize,
    );
    return new ResponseFormat(reportedPlaces);
  }

  // 유저의 제보 장소 모두 가져오기 GET
  @Get('/reports/me')
  @Roles('user')
  @UseGuards(AuthGuard, RoleGuard)
  async getReportedPlacesByUser(
    @Req() req,
    @Query('pageNumber') pageNumber: number,
    @Query('pageSize') pageSize: number,
  ): Promise<ResponseFormat> {
    const user_id = req.user.userId;
    const reportedPlaces = await this.reportedPlaceService.getReportedPlaces(
      pageNumber,
      pageSize,
      user_id,
    );
    return new ResponseFormat(reportedPlaces);
  }

  // 새로운 장소 제보 POST
  @Post('/reports')
  @Roles('user')
  @UseGuards(AuthGuard, RoleGuard)
  async createReportedPlace(
    @Req() req,
    @Body() createReportedPlaceDto: CreateReportedPlaceDto,
  ): Promise<ResponseFormat> {
    const user_id = req.user.userId;
    const newReportedPlace =
      await this.reportedPlaceService.createReportedPlace(
        createReportedPlaceDto,
        user_id,
      );
    return new ResponseFormat(newReportedPlace);
  }

  // 제보 장소 수정 PUT
  @Put('/reports/:reportedPlaceId')
  @Roles('user')
  @UseGuards(AuthGuard, RoleGuard)
  async updateReportedPlace(
    @Req() req,
    @Param('reportedPlaceId') reportedPlaceId: string,
    @Body() updateReportedPlaceDto: CreateReportedPlaceDto,
  ): Promise<ResponseFormat> {
    const user_id = req.user.userId;
    const updatedReportedPlace =
      await this.reportedPlaceService.updateReportedPlace(reportedPlaceId, {
        updateReportedPlaceDto,
        user_id,
      });
    return new ResponseFormat(updatedReportedPlace);
  }

  // 제보 장소 삭제 DELETE
  @Delete('/reports/:reportedPlaceId')
  @Roles('user')
  @UseGuards(AuthGuard, RoleGuard)
  async deleteReportedPlace(
    @Param('reportedPlaceId') reportedPlaceId: string,
  ): Promise<ResponseFormat> {
    const deletedReportedPlace =
      await this.reportedPlaceService.deleteReportedPlace(reportedPlaceId);
    return new ResponseFormat(deletedReportedPlace);
  }
}
