import {
  IsBoolean,
  IsString,
  IsArray,
  IsNotEmpty,
  IsOptional,
  Matches,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsBoolean()
  @IsNotEmpty()
  vegan_option: boolean;

  @IsString()
  @Matches(
    /^(\d{2}-\d{4}-\d{4}|\d{3}-\d{4}-\d{4}|\d{4}-\d{4}-\d{4}|\d{2}-\d{3}-\d{4}|\d{3}-\d{3}-\d{4})$/,
    {
      message: 'Invalid phone number format',
    },
  )
  @IsOptional()
  tel: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  address_lot_number: string;

  @IsString()
  @IsOptional()
  address_detail: string = '';

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNotEmpty()
  location: number[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  open_times: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sns_url: string[] = [];
}
