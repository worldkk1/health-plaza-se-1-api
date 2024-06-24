import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTodoListDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
