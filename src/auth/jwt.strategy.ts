// src/auth/jwt.strategy.ts

import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
// -------------------------------------------------------------------------
// IMPORTAÇÕES FALTANTES/CRÍTICAS
import { UsuarioService } from '../usuario/service'; // <-- CRÍTICO: Serviço para buscar o usuário
import { Usuario } from '../usuario/entity';
// -------------------------------------------------------------------------

// Interface que define a estrutura do payload que estará dentro do token JWT
export interface JwtPayload {
  id: string;
  email: string;
  tipo: string; // Para o RolesGuard
}

@Injectable()
// Adicionamos 'jwt' explicitamente (opcional, mas recomendado para clareza)
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') { 
  constructor(
    private readonly configService: ConfigService,
    // -------------------------------------------------------------------------
    // CRÍTICO: INJETAR O SERVICE para que o NestJS reconheça o Strategy
    @Inject(forwardRef(() => UsuarioService))
    private readonly usuarioService: UsuarioService, 
    // -------------------------------------------------------------------------
  ) {
    // 1. Configura a estratégia 'jwt'
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ignoreExpiration: false, 
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback_secret_deve_ser_substituido', 
    });
  }

  // 2. Método de validação: chamado APÓS o token ser decodificado com sucesso
  // O payload é o objeto decodificado (o que você assinou no login)
  async validate(payload: JwtPayload): Promise<Usuario> {
    // Busca o usuário no banco de dados para garantir que ele ainda exista
    const usuario = await this.usuarioService.findOne(payload.id);

    if (!usuario) {
        throw new UnauthorizedException('Token inválido ou usuário não encontrado.');
    }

    // Retorna o objeto completo do usuário para ser anexado ao `req.user`
    return usuario; 
  }
}