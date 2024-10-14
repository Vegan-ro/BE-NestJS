import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { BookmarkService } from "./bookmark.service";
import { ResponseFormat } from 'src/global/response.format';
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from '../auth/roles.decorator';
import { RoleGuard } from '../auth/role.guard';
import { CreateBookmarkDto } from "./dto/create.bookmark.dto";

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  // 북마크 전체 조회(유저)
  @Get('me')
  @Roles('user')
  @UseGuards(AuthGuard,RoleGuard)
  async getBookmarksByUserId(@Req() req, @Query('pageNumber') pageNumber: number, @Query('pageSize') pageSize: number) {
    const userId = req.user.userId;
    const bookmarks = await this.bookmarkService.getBookmarksByUserId(userId, pageNumber, pageSize);
    return  new ResponseFormat(bookmarks);
  }
// 북마크 추가 (유저)
@Post()
@Roles('user')
@UseGuards(AuthGuard,RoleGuard)
async postBookmark(@Body() createBookmarkDto: CreateBookmarkDto, @Req() req) {
  const userId = req.user.userId;
  const { placeId } = createBookmarkDto; 
  const newBookmark = await this.bookmarkService.createBookmark(userId, placeId); 
  return new ResponseFormat(newBookmark);
}


  // 북마크 삭제 (유저)
  @Delete(':bookmarkId')
  @Roles('user')
  @UseGuards(AuthGuard,RoleGuard)
  async deleteBookmark(@Param('bookmarkId') bookmarkId: string) {
    const deletedBookmark = await this.bookmarkService.deleteBookmark(bookmarkId);
    return  new ResponseFormat(deletedBookmark);
  }

  // 북마크 많은 순으로 정렬(장소)
  @Get()
  async getMostBookmarkedPlaces() {
    const mostBookmarkedPlaces = await this.bookmarkService.getMostBookmarkedPlaces();
    return  new ResponseFormat(mostBookmarkedPlaces);
  }

  // 북마크 확인 GET /bookmarks/check?placeId=value
  @Get('check')
  @Roles('user')
  @UseGuards(AuthGuard,RoleGuard)
  async getBookmark(@Query('placeId') placeId: string, @Req() req) {
    const userId = req.user.userId;
    const { bookmarkId, isBookmarked } = await this.bookmarkService.getBookmark(userId, placeId);
    return  new ResponseFormat({ bookmarkId, isBookmarked });
  }
}
