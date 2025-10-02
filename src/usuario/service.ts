import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { Usuario } from './entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    // Injeção do Model do Sequelize
    @InjectModel(Usuario)
    private readonly usuarioModel: typeof Usuario,
  ) {}

  // Método para criar um novo usuário
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    
    // 1. Verificar se o e-mail já está em uso
    const emailExistente = await this.usuarioModel.findOne({ 
      where: { email: createUsuarioDto.email } 
    });
    
    if (emailExistente) {
      throw new ConflictException('O e-mail fornecido já está em uso.');
    }
    
    // 2. Hash da senha (Segurança)
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(createUsuarioDto.senha, salt);

    // 3. Criar a instância do usuário
    const novoUsuario = new Usuario({
      ...createUsuarioDto,
      senha: senhaHash, // Armazena a senha hasheada
    });

    // 4. Salvar no banco de dados
    await novoUsuario.save();
    
    const usuarioSemSenha = novoUsuario.toJSON();
    delete usuarioSemSenha.senha; 
    
    return usuarioSemSenha as Usuario;
  }
  
  
  // Método de suporte para a autenticação (buscar pelo e-mail, incluindo a senha)
  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioModel.findOne({ 
      where: { email },
      attributes: { include: ['senha'] } // Inclui a senha, que é excluída por padrão
    });
  }

  // ... (Outros 5 endpoints do CRUD serão adicionados aqui)
}