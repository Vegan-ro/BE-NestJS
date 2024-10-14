import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  Matches,
  IsOptional,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateReportedPlaceDto {
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
  @IsOptional()
  @Matches(
    /^(\d{2}-\d{4}-\d{4}|\d{3}-\d{4}-\d{4}|\d{4}-\d{4}-\d{4}|\d{2}-\d{3}-\d{4}|\d{3}-\d{3}-\d{4})$/,
    {
      message: 'Invalid phone number format',
    },
  )
  tel: string = '';

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
  @IsNumber({}, { each: true })
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
