import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// DTO Básico de Paginação (Reutilizável)
export class PaginationQueryDto {
  
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O número da página deve ser um inteiro.' })
  @Min(1, { message: 'A página deve ser maior ou igual a 1.' })
  @ApiProperty({ required: false, default: 1, description: 'Número da página de resultados.' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O limite deve ser um inteiro.' })
  @Min(1, { message: 'O limite deve ser maior ou igual a 1.' })
  @ApiProperty({ required: false, default: 10, description: 'Limite de itens por página.' })
  limit?: number = 10;
}