import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateTodoListDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
