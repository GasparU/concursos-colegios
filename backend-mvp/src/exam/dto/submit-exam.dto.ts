import { IsNumber, IsOptional, IsObject } from 'class-validator';

export class SubmitExamDto {
  @IsObject()
  answers!: Record<string, string>; 

  @IsObject()
  @IsOptional()
  timings?: Record<string, number>;

  @IsNumber()
  @IsOptional()
  timeUsedSeconds?: number;

  @IsNumber()
  @IsOptional()
  idealTimeSeconds?: number;
}