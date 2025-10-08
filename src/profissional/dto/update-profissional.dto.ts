// src/profissional/dto/update-profissional.dto.ts

import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UpdateUsuarioDto } from '../../usuario/dto/update-usuario.dto';

// Reutiliza o DTO de atualização do Usuário para dados básicos.
class UpdateUsuarioNestedDto extends PartialType(UpdateUsuarioDto) {}

/**
 * DTO para atualização parcial de dados do Profissional.
 * Nota: O campo 'usuario' é opcional e aninhado, permitindo atualizar o nome/email/senha.
 */
export class UpdateProfissionalDto {

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUsuarioNestedDto)
  @ApiProperty({ 
    type: UpdateUsuarioNestedDto, 
    required: false, 
    description: 'Dados de usuário para atualização (opcional). Use para mudar nome, senha, etc.' 
  })
  usuario?: UpdateUsuarioNestedDto;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Número do Registro CREF.', example: '123456-G/SP' })
  registroCREF?: string; 

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Especialidade do profissional.' })
  especialidade?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Cidade onde atua.' })
  cidade?: string;
  
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Biografia/descrição do profissional.' })
  biografia?: string;
}