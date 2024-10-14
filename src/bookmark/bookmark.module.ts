import { Module } from "@nestjs/common";
import { BookmarkController } from "./bookmark.controller";
import { BookmarkRepository } from "./bookmark.repository";
import { BookmarkService } from "./bookmark.service";
import { MongooseModule } from "@nestjs/mongoose";
import { bookmarkSchema } from "./bookmark.schema";
import { RoleGuard } from "src/auth/role.guard";

@Module({
    imports: [
        MongooseModule.forFeature([
          { name: 'Bookmark', schema: bookmarkSchema },
        ]),
      ],
    controllers: [BookmarkController],
    providers: [BookmarkService, BookmarkRepository, RoleGuard],
    exports: [BookmarkRepository], 
})
export class BookmarkModule {}
