import { IsString, IsNotEmpty } from 'class-validator';

export class PatchReviewDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
