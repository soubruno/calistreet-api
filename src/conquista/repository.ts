import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Conquista, TipoConquista } from './entity';
import { UsuarioConquista } from './usuario-conquista.entity';
import { CreateConquistaDto } from './dto/create-conquista.dto';
import { UpdateConquistaDto } from './dto/update-conquista.dto';
import { FindAllConquistasDto } from './dto/find-all-conquistas.dto';
import { Usuario } from '../usuario/entity';

@Injectable()
export class ConquistaRepository {
  constructor(
    @InjectModel(Conquista)
    private readonly conquistaModel: typeof Conquista,
    @InjectModel(UsuarioConquista)
    private readonly usuarioConquistaModel: typeof UsuarioConquista,
  ) {}

  // --- 1. CRUD do Catálogo (Gerenciado por ADMIN) ---
  
  async create(data: CreateConquistaDto): Promise<Conquista> {
    // A checagem de nome duplicado (unique: true) será tratada no Service/DB
    return this.conquistaModel.create(data as Conquista);
  }

  async findById(id: string): Promise<Conquista> {
    const conquista = await this.conquistaModel.findByPk(id);
    if (!conquista) {
      throw new NotFoundException(`Conquista com ID ${id} não encontrada.`);
    }
    return conquista;
  }
  
  async update(id: string, data: UpdateConquistaDto): Promise<Conquista> {
    const conquista = await this.findById(id);
    await conquista.update(data as Conquista);
    return conquista;
  }

  async remove(id: string): Promise<void> {
    const result = await this.conquistaModel.destroy({ where: { id } });
    if (result === 0) {
        throw new NotFoundException(`Conquista com ID ${id} não encontrada para exclusão.`);
    }
  }

  // --- 2. Listagem do Catálogo (Com Filtros) ---

  async findAll(queryDto: FindAllConquistasDto): Promise<any> {
    const limit = queryDto.limit || 10;
    const offset = ((queryDto.page || 1) - 1) * limit;

    const whereCondition: any = {};
    
    if (queryDto.tipo) { // Filtro por Tipo (Treino Completo, Volume Total, etc.)
        whereCondition.tipo = queryDto.tipo;
    }

    return this.conquistaModel.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      order: [['titulo', 'ASC']],
    });
  }

  /**
   * Busca uma conquista pelo título. Usado para checagem de conflito.
   */
  async findByTitulo(titulo: string): Promise<Conquista | null> {
    return this.conquistaModel.findOne({ where: { titulo } });
  }

  // --- 3. Lógica de Desbloqueio e Leitura de Usuário ---

  /**
   * Registra o desbloqueio de uma conquista para um usuário (M:N).
   */
  async unlockConquista(usuarioId: string, conquistaId: string): Promise<UsuarioConquista> {
      // Cria o registro na tabela de junção (UsuarioConquista)
      return this.usuarioConquistaModel.create({
          usuarioId,
          conquistaId,
      } as UsuarioConquista);
  }

  /**
   * Lista as conquistas que um usuário ESPECÍFICO desbloqueou.
   */
  async findUnlockedByUser(usuarioId: string): Promise<Conquista[]> {

        const includeOptions: any[] = [{
            model: Usuario,
            as: 'usuarios',
            attributes: [],
            through: {
                model: UsuarioConquista, 
                where: { usuarioId },
                attributes: ['createdAt'],
            },
            required: true, 
        }];

        return this.conquistaModel.findAll({
            order: [['titulo', 'ASC']],
            include: includeOptions,
        });
  }

  /**
   * Busca uma regra de conquista específica por Tipo e Parâmetro.
   */
  async findRegraByTipoAndParam(tipo: TipoConquista, regraParametro: string): Promise<Conquista | null> {
    return this.conquistaModel.findOne({
      where: { tipo, regraParametro }
    });
  }
}