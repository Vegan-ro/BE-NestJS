import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { BookmarkRepository } from "./bookmark.repository";

@Injectable()
export class BookmarkService {
    constructor(private readonly bookmarkRepository: BookmarkRepository) {}

     // 북마크 전체 조회 (유저)
    async getBookmarksByUserId(userId: string, pageNumber: number, pageSize: number) {
      const bookmarks = await this.bookmarkRepository.getBookmarksByUserId(userId, pageNumber, pageSize);
      return bookmarks;
    }
  
    
  // 북마크 추가 (유저)
    async createBookmark(userId: string, placeId: string) {
      const existingBookmark = await this.bookmarkRepository.getBookmarkByUserIdAndPlaceId(userId, placeId);
  
      if (existingBookmark) {
        throw new BadRequestException('이미 북마크한 장소입니다.');
      }
  
      const newBookmark = await this.bookmarkRepository.createBookmark(userId, placeId);
      if (!newBookmark) {
        throw new BadRequestException('북마크 등록에 실패하였습니다.');
      }
  
      return { message: '정상적으로 등록되었습니다.', newBookmark };
    }
  
      // 북마크 삭제 (유저)
    async deleteBookmark(id: string) {
      const deletedBookmark = await this.bookmarkRepository.deleteBookmark(id);
      if (!deletedBookmark) {
        throw new NotFoundException('해당 북마크가 존재하지 않습니다');
      }
  
      return {
        message: '북마크정보가 성공적으로 삭제되었습니다.',
        deletedBookmark,
      };
    }
    // 북마크 많은 순으로 정렬(장소)
    async getMostBookmarkedPlaces() {
      const mostBookmarkedPlaces = await this.bookmarkRepository.getMostBookmarkedPlaces();
  
      if (mostBookmarkedPlaces.length === 0) {
        throw new NotFoundException('해당 조건을 만족하는 장소가 존재하지 않습니다');
      }
  
      return mostBookmarkedPlaces;
    }
    // 북마크 확인
    async getBookmark(userId: string, placeId: string) {
      const bookmarkId = await this.bookmarkRepository.getBookmarkByUserIdAndPlaceId(userId, placeId);
  
      return { bookmarkId, isBookmarked: bookmarkId !== null };
    }
  }