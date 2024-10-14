import { IsString } from 'class-validator';

export class CreateBookmarkDto {
  @IsString()
  readonly placeId: string;
}
