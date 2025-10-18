import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes, Op } from 'sequelize';
import { TipoUsuario, Usuario } from './entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { FindAllUsuariosDto } from './dto/find-all-usuarios.dto'; 
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioRepository {
  constructor(
    @InjectModel(Usuario)
    private readonly usuarioModel: typeof Usuario,
  ) {}

  /**
   * Encontra um usuário pelo email, incluindo a senha para a validação de login.
   * @param email O email do usuário.
   */
  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioModel.findOne({ 
      where: { email },
      attributes: { include: ['senha'] }
    });
  }

  /**
   * Cria e salva um novo usuário no banco de dados.
   * @param data Dados validados do usuário.
   */
  async create(data: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioModel.create(data as unknown as CreationAttributes<Usuario>);
    // return this.usuarioModel.create(data as unknown as CreationAttributes<Usuario>);

  }

  /**
   * Busca um usuário pelo ID.
   * @param id ID do usuário (UUID).
   */
  async findById(id: string): Promise<Usuario> {
    const usuario = await this.usuarioModel.findByPk(id, {
        attributes: { exclude: ['senha'] }
    });
    if (!usuario) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    return usuario;
  }
  
  /**
   * Lista usuários com filtros e paginação.
   * @param queryDto Filtros e parâmetros de paginação.
   */
  async findAll(queryDto: FindAllUsuariosDto): Promise<{ count: number, rows: Usuario[] }> {
    const limit = queryDto.limit || 10;
    const offset = ((queryDto.page || 1) - 1) * limit;

    const whereCondition: any = {};
    
    if (queryDto.nome) {
        whereCondition.nome = { [Op.iLike]: `%${queryDto.nome}%` };
    }
    
    if (queryDto.genero) {
        whereCondition.genero = queryDto.genero;
    }

    if (queryDto.email) {
        whereCondition.email = { [Op.iLike]: `%${queryDto.email}%` };
    }

    return this.usuarioModel.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      order: [['nome', 'ASC']],
      attributes: { exclude: ['senha'] }
    });
  }

  /**
   * Atualiza um usuário.
   * @param id ID do usuário.
   * @param data Dados para atualização.
   */
  async update(id: string, data: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findById(id); // Reusa o findById para verificar a existência
    
    await usuario.update(data as unknown as CreationAttributes<Usuario>);
    return usuario;
  }

  /**
   * Exclui um usuário.
   * @param id ID do usuário.
   */
  async remove(id: string): Promise<void> {
    const result = await this.usuarioModel.destroy({ where: { id } });
    if (result === 0) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado para exclusão.`);
    }
  }

  /**
   * Conta o total de usuários e profissionais.
   */
  async countByTipo(tipo: TipoUsuario): Promise<number> {
    return this.usuarioModel.count({ where: { tipo } });
  }
}