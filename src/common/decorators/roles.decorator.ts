import { SetMetadata } from '@nestjs/common';
import { TipoUsuario } from '../enums/tipo-usuario.enum';

export const ROLES_KEY = 'roles';

/**
 * Define os tipos de usuário (papéis) que têm permissão para acessar um endpoint.
 * Ex: @Roles(TipoUsuario.ADMIN, TipoUsuario.PROFISSIONAL)
 */
export const Roles = (...roles: TipoUsuario[]) => SetMetadata(ROLES_KEY, roles);