import { IsNotEmpty, IsString, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateUsuarioDto } from '../../usuario/dto/create-usuario.dto';

export class CreateProfissionalDto {

  @ApiProperty({ type: CreateUsuarioDto, description: 'Dados de usuário (nome, email, senha) para a conta do profissional.' })
  @ValidateNested()
  @Type(() => CreateUsuarioDto)
  declare usuario: CreateUsuarioDto;

  @IsString({ message: 'O registro CREF é obrigatório.' })
  @IsNotEmpty({ message: 'O registro CREF não pode ser vazio.' })
  @ApiProperty({ description: 'Número do Registro CREF.', example: '123456-G/SP' })
  declare registroCREF: string; 

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Especialidade do profissional.' })
  declare especialidade?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Cidade onde atua.' })
  declare cidade?: string;
  
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Biografia/descrição do profissional.' })
  declare biografia?: string;
}