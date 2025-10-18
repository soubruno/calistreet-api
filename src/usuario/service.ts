import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Usuario } from './entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { FindAllUsuariosDto } from './dto/find-all-usuarios.dto'; 
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioRepository } from './repository';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  // 1. Criação de Usuário
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    
    const emailExistente = await this.usuarioRepository.findByEmail(createUsuarioDto.email);
    
    if (emailExistente) {
      throw new ConflictException('O e-mail fornecido já está em uso.');
    }
    
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(createUsuarioDto.senha, salt);

    const novoUsuario = await this.usuarioRepository.create({
      ...createUsuarioDto,
      senha: senhaHash, 
    });
    
    const { senha, ...usuarioSemSenha } = novoUsuario.toJSON(); 
    return usuarioSemSenha as Usuario;
  }
  
  // 2. Método de suporte para a autenticação
  async findByEmailForAuth(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findByEmail(email);
  }

  // 3. Listagem com Paginação e Filtros
  async findAll(queryDto: FindAllUsuariosDto): Promise<any> {

    const { count, rows } = await this.usuarioRepository.findAll(queryDto);

    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    
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
  async updateFoto(id: string, fotoUrl: string): Promise<Usuario> {
      return this.usuarioRepository.update(id, { fotoUrl } as UpdateUsuarioDto);
  }

  async updateCapa(id: string, capaUrl: string): Promise<Usuario> {
      return this.usuarioRepository.update(id, { capaUrl } as UpdateUsuarioDto);
  }
}