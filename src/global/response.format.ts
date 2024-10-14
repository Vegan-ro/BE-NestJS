export class ResponseFormat {
  error: string | null;
  data: any;

  constructor(data: any, errorMessage?: string) {
    return {
      error: errorMessage ?? null,
      data,
    };
  }
}
