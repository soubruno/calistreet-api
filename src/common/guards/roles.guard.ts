import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TipoUsuario } from '../enums/tipo-usuario.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Usuario } from '../../usuario/entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Coleta os papéis necessários (definidos no @Roles)
    const requiredRoles = this.reflector.getAllAndOverride<TipoUsuario[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Se nenhum papel for definido, o acesso é permitido por padrão
    if (!requiredRoles) {
      return true;
    }

    // 2. Obtém o usuário logado (adicionado ao request pelo JwtStrategy)
    const { user } = context.switchToHttp().getRequest();
    
    const usuarioLogado: Usuario = user;

    if (!usuarioLogado) {
        // Se não houver usuário no request (o JwtGuard impede isso)
        return false;
    }

    // 3. Verifica se o tipo do usuário logado está na lista de papéis requeridos
    return requiredRoles.some((role) => usuarioLogado.tipo === role);
  }
}