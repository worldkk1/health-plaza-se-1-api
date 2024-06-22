import { IsString } from 'class-validator';

export class CreateTodoListDto {
  @IsString()
  content: string;
}
