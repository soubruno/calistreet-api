import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsuarioService } from '../usuario/service';
import { Usuario } from '../usuario/entity';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './jwt.strategy';


@Injectable()
export class AuthService {
  constructor(
    // Injeção de dependências:
    private readonly usuarioService: UsuarioService, // Para buscar o usuário
    private readonly jwtService: JwtService,         // Para criar o token
  ) {}

  /**
   * 1. Valida o usuário (apenas email e senha).
   */
  async validateUser(email: string, senha: string): Promise<Usuario | null> {
    // O findByEmailForAuth do UsuarioService busca o usuário incluindo a SENHA
    const usuario = await this.usuarioService.findByEmailForAuth(email); 

    if (usuario) {
      // Compara a senha em texto puro com o hash salvo
      const isMatch = await bcrypt.compare(senha, usuario.senha); 
      
      if (isMatch) {
        // Se a senha estiver correta, retorna o usuário sem a senha.
        const { senha, ...result } = usuario.toJSON();
        return result as Usuario;
      }
    }
    return null; // Credenciais inválidas
  }

  /**
   * 2. Gera o token JWT após o usuário ser validado.
   */
  async login(loginDto: LoginDto): Promise<{ accessToken: string, user: Usuario }> {
    const { email, senha } = loginDto;
    
    // Usa o método de validação
    const usuarioValidado = await this.validateUser(email, senha);

    if (!usuarioValidado) {
      throw new UnauthorizedException('Credenciais inválidas. Verifique seu e-mail e senha.');
    }
    
    // Payload do token
    const payload: JwtPayload = { 
        id: usuarioValidado.id, 
        email: usuarioValidado.email, 
        tipo: usuarioValidado.tipo 
    };
    
    // Gera o token
    const accessToken = this.jwtService.sign(payload);
    
    return { 
        accessToken, 
        user: usuarioValidado 
    };
  }
}