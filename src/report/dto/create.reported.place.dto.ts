import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  Matches,
  IsOptional,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
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
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @IsNumber({}, { each: true })
  @Min(-180, { each: true, message: 'longitude must be at least -90.' }) // Min longitude
  @Max(180, { each: true, message: 'longitude must not exceed 90.' }) // Max longitude
  @Min(-90, { each: true, message: 'Latitude must be at least -90.' }) // Min latitude
  @Max(90, { each: true, message: 'Latitude must not exceed 90.' }) // Max latitude
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
