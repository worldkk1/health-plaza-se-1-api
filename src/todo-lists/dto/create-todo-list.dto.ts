import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoListDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
