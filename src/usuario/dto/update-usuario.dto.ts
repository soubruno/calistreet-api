import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    
    @IsOptional()
    @ApiProperty({ description: 'A senha é geralmente atualizada em uma rota separada por segurança.' })
    senha?: string;

    @IsOptional()
    @ApiProperty({ description: 'O e-mail é geralmente atualizado em uma rota separada por segurança.' })
    email?: string;

    @IsOptional()
    @IsString()
    fotoUrl?: string;

    @IsOptional()
    @IsString()
    capaUrl?: string;
}