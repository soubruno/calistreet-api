import { IsDateString, IsNotEmpty, IsNumber, IsEnum, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoMedida } from '../medida-fisica.entity';

export class CreateMedidaDto {
  @IsDateString()
  @ApiProperty({ description: 'Data do registro da medida.', example: '2025-10-09' })
  declare dataRegistro: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Nome da medida (Ex: Circunferência Braço, Peso).', example: 'Peso' })
  declare nomeMedida: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({ description: 'Valor numérico da medida.', example: 85.5 })
  declare valor: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Unidade de medida (Ex: kg, cm, %).', example: 'kg' })
  declare unidade: string;

  @IsEnum(TipoMedida)
  @ApiProperty({ enum: TipoMedida, description: 'Tipo da medida (PESO, CIRCUNFERENCIA, etc.).' })
  declare tipo: TipoMedida;
}