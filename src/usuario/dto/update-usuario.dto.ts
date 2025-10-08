import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * UpdateUsuarioDto herda todas as regras de validação (decoradores)
 * de CreateUsuarioDto, mas as torna opcionais (PartialType).
 * * Excluímos 'senha' e 'email' para que sejam atualizados em endpoints 
 * separados (por segurança), mas incluímos campos específicos para PUT/PATCH.
 */
export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    
    // Sobrescrevemos a senha e e-mail (se vierem), mas normalmente seriam em rotas separadas
    // Por exemplo, você pode querer bloquear a mudança de email e senha aqui,
    // garantindo que eles sejam nulos:
    
    @IsOptional()
    @ApiProperty({ description: 'A senha é geralmente atualizada em uma rota separada por segurança.' })
    senha?: string;

    @IsOptional()
    @ApiProperty({ description: 'O e-mail é geralmente atualizado em uma rota separada por segurança.' })
    email?: string;

    // Campos de foto/capa que podem ser atualizados via PATCH (embora o upload use outra lógica)
    @IsOptional()
    @IsString()
    fotoUrl?: string;

    @IsOptional()
    @IsString()
    capaUrl?: string;
}