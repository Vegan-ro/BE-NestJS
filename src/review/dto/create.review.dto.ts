import { IsString, IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  place_id: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
