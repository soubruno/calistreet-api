import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Usuario } from './entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { FindAllUsuariosDto } from './dto/find-all-usuarios.dto'; 
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioRepository } from './repository'; // Importação do Repository

@Injectable()
export class UsuarioService {
  constructor(
    // Injeção do Repository
    private readonly usuarioRepository: UsuarioRepository, 
  ) {}

  // 1. Criação de Usuário
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    
    // Verificar se o e-mail já está em uso (A lógica de negócio continua no Service)
    const emailExistente = await this.usuarioRepository.findByEmail(createUsuarioDto.email);
    
    if (emailExistente) {
      throw new ConflictException('O e-mail fornecido já está em uso.');
    }
    
    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(createUsuarioDto.senha, salt);

    // Delega a persistência (CREATE) ao Repository
    const novoUsuario = await this.usuarioRepository.create({
      ...createUsuarioDto,
      senha: senhaHash, 
    });
    
    // Retorna o objeto (a exclusão de senha é tratada no Repository ou no DTO)
    const { senha, ...usuarioSemSenha } = novoUsuario.toJSON(); 
    return usuarioSemSenha as Usuario;
  }
  
  // 2. Método de suporte para a autenticação
  async findByEmailForAuth(email: string): Promise<Usuario | null> {
    // Delega a busca ao Repository
    return this.usuarioRepository.findByEmail(email);
  }

  // 3. Listagem com Paginação e Filtros
  async findAll(queryDto: FindAllUsuariosDto): Promise<any> {
    // Delega a query findAndCountAll ao Repository
    const { count, rows } = await this.usuarioRepository.findAll(queryDto);

    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    
    // A lógica de formatação da resposta paginada continua no Service
    return {
      data: rows,
      total: count,
      page: page,
      limit: limit,
      totalPages: Math.ceil(count / limit),
      hasNextPage: page * limit < count,
    };
  }

  // 4. Busca por ID
  async findOne(id: string): Promise<Usuario> {
      return this.usuarioRepository.findById(id);
  }

  // 5. Atualização (PUT/PATCH)
  async update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
      
    if (updateUsuarioDto.senha) {
        const salt = await bcrypt.genSalt(10);
        updateUsuarioDto.senha = await bcrypt.hash(updateUsuarioDto.senha, salt);
    }

    return this.usuarioRepository.update(id, updateUsuarioDto);
  }

  // 6. Exclusão
  async remove(id: string): Promise<void> {
      await this.usuarioRepository.remove(id);
  }
}