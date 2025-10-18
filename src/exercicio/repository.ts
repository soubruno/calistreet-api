import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Exercicio } from './entity';
import { CreateExercicioDto } from './dto/create-exercicio.dto';
import { UpdateExercicioDto } from './dto/update-exercicio.dto';
import { FindAllExerciciosDto } from './dto/find-all-exercicios.dto';
import { Usuario } from '../usuario/entity';
import { UsuarioExercicioFavorito } from './usuario-exercicio-favorito.entity';

@Injectable()
export class ExercicioRepository {
  constructor(
    @InjectModel(Exercicio)
    private readonly exercicioModel: typeof Exercicio,
    @InjectModel(UsuarioExercicioFavorito)
    private readonly favoritoModel: typeof UsuarioExercicioFavorito,
  ) {}

  // --- CRUD Básico ---
  
  async create(data: CreateExercicioDto): Promise<Exercicio> {
    return this.exercicioModel.create(data as Exercicio);
  }

  async findByName(nome: string): Promise<Exercicio | null> {
    return this.exercicioModel.findOne({ where: { nome } });
  }

  async findById(id: string): Promise<Exercicio> {
    const exercicio = await this.exercicioModel.findByPk(id);
    if (!exercicio) {
      throw new NotFoundException(`Exercício com ID ${id} não encontrado.`);
    }
    return exercicio;
  }
  
  async update(id: string, data: UpdateExercicioDto): Promise<Exercicio> {
    const exercicio = await this.findById(id);
    await exercicio.update(data as Exercicio);
    return exercicio;
  }

  async remove(id: string): Promise<void> {
    const result = await this.exercicioModel.destroy({ where: { id } });
    if (result === 0) {
        throw new NotFoundException(`Exercício com ID ${id} não encontrado para exclusão.`);
    }
  }

  // --- Listagem e Filtros ---

  async findAll(queryDto: FindAllExerciciosDto, usuarioId?: string): Promise<any> {
    const limit = queryDto.limit || 10;
    const offset = ((queryDto.page || 1) - 1) * limit;

    const whereCondition: any = {};
    
    if (queryDto.nome) {
        whereCondition.nome = { [Op.iLike]: `%${queryDto.nome}%` };
    }
    if (queryDto.grupoMuscular) {
        whereCondition.grupoMuscular = queryDto.grupoMuscular;
    }
    if (queryDto.subgrupoMuscular) {
        whereCondition.subgrupoMuscular = queryDto.subgrupoMuscular;
    }
    if (queryDto.equipamentos) {
        whereCondition.equipamentosNecessarios = { [Op.iLike]: `%${queryDto.equipamentos}%` };
    }

    // Lógica para incluir a lista de favoritos (se um usuarioId foi fornecido)
    const includeOptions: any[] = [];
    if (usuarioId) {
        // Busca a tabela de junção para ver se este usuário favoritou o exercício
        includeOptions.push({
            model: Usuario,
            as: 'usuariosFavoritaram', // Nome da propriedade BelongsToMany na Entity
            attributes: [],
            through: {
                model: UsuarioExercicioFavorito,
                attributes: ['usuarioId'],
                where: { usuarioId }, // Filtra apenas o favorito deste usuário
            },
            required: false
        });
    }

    return this.exercicioModel.findAndCountAll({
      where: whereCondition,
      include: includeOptions.length ? includeOptions : undefined,
      limit: limit,
      offset: offset,
      order: [['nome', 'ASC']],
    });
  }

  // --- Lógica de Favoritos ---

  async createFavorito(usuarioId: string, exercicioId: string): Promise<UsuarioExercicioFavorito> { // <<< NOVO MÉTODO
      return this.favoritoModel.create({
          usuarioId,
          exercicioId,
      } as UsuarioExercicioFavorito);
  }

  async removeFavorito(usuarioId: string, exercicioId: string): Promise<number> { // <<< NOVO MÉTODO
      return this.favoritoModel.destroy({
          where: { usuarioId, exercicioId },
      });
  }

  async findFavoritos(usuarioId: string, queryDto: FindAllExerciciosDto): Promise<any> {
    const limit = queryDto.limit || 10;
    const offset = ((queryDto.page || 1) - 1) * limit;

    const includeClause: any[] = [{
      model: Usuario,
      as: 'usuariosFavoritaram',
      attributes: [],
      through: {
        model: UsuarioExercicioFavorito,
        where: { usuarioId },
      },
      required: true 
    }];

    // Busca exercícios que ESTÃO na tabela de favoritos para este usuário
    return this.exercicioModel.findAndCountAll({
      limit,
      offset,
      order: [['nome', 'ASC']],
      include: includeClause,
    });
  }
}