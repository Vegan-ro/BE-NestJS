export class CreateImageDto {
    name: string;
    url: {
      basic_url: string;
      pin_url?: string;
    };
  }