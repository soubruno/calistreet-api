import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes, Op, Sequelize } from 'sequelize';
import { Progresso } from './entity';
import { ProgressoExercicio } from './progresso-exercicio.entity';
import { CreateProgressoDto } from './dto/create-progresso.dto';
import { FindAllProgressoDto } from './dto/find-all-progresso.dto';
import { Treino } from '../treino/entity';
import { Exercicio } from '../exercicio/entity';
import { MedidaFisica } from './medida-fisica.entity';
import { CreateMedidaDto } from './dto/create-medida.dto';

@Injectable()
export class ProgressoRepository {
  constructor(
    @InjectModel(Progresso)
    private readonly progressoModel: typeof Progresso,
    @InjectModel(ProgressoExercicio)
    private readonly progressoExercicioModel: typeof ProgressoExercicio,
    @InjectModel(MedidaFisica)
    private readonly medidaFisicaModel: typeof MedidaFisica,
  ) {}

  // --- 1. CRUD de Histórico (Progresso) ---

  /**
   * Cria o registro da sessão e os resultados dos exercícios (transacionalmente).
   */
  async create(data: CreateProgressoDto, usuarioId: string): Promise<Progresso> {
    
    const novaSessao = await this.progressoModel.create({
      ...data,
      usuarioId,
    } as unknown as CreationAttributes<Progresso>);

    const resultados = data.resultadosExercicios.map(resultado => ({
      ...resultado,
      progressoId: novaSessao.id,
    }));

    await this.progressoExercicioModel.bulkCreate(resultados as ProgressoExercicio[]);

    return this.findById(novaSessao.id);
  }

  async findById(id: string): Promise<Progresso> {
    const progresso = await this.progressoModel.findByPk(id, {
      include: [
        { model: ProgressoExercicio, include: [Exercicio] }, // Detalhes dos exercícios executados
        { model: Treino, as: 'treinoModelo', attributes: ['nome', 'nivel'] } // Nome do template usado
      ],
    });
    if (!progresso) {
      throw new NotFoundException(`Registro de progresso com ID ${id} não encontrado.`);
    }
    return progresso;
  }

  /**
   * Atualiza o registro da sessão de progresso.
   */
  async updateSessao(sessaoId: string, data: any): Promise<Progresso> {
    const progresso = await this.findById(sessaoId);
    await progresso.update(data as any);
    return progresso;
  }
  
  /**
   * Remove uma sessão de progresso (cabeçalho e detalhes).
   */
  async removeSessao(sessaoId: string): Promise<void> {

    await this.progressoExercicioModel.destroy({ where: { progressoId: sessaoId } });
    
    const result = await this.progressoModel.destroy({ where: { id: sessaoId } });
    
    if (result === 0) {
        throw new NotFoundException(`Sessão de progresso com ID ${sessaoId} não encontrada.`);
    }
  }

  // --- 2. Listagem com Filtros (Histórico) ---

  async findAll(usuarioId: string, queryDto: FindAllProgressoDto): Promise<any> {
    const limit = queryDto.limit || 10;
    const offset = ((queryDto.page || 1) - 1) * limit;

    const whereCondition: any = { usuarioId }; // Filtra APENAS o progresso do usuário logado
    
    if (queryDto.treinoId) {
        whereCondition.treinoId = queryDto.treinoId;
    }
    if (queryDto.status) {
        whereCondition.status = queryDto.status;
    }
    if (queryDto.dataMinima || queryDto.dataMaxima) {
        whereCondition.dataInicio = { [Op.between]: [queryDto.dataMinima, queryDto.dataMaxima] };
    }

    return this.progressoModel.findAndCountAll({
      where: whereCondition,
      include: [
        { model: Treino, as: 'treinoModelo', attributes: ['nome'] },
      ],
      limit: limit,
      offset: offset,
      order: [['dataInicio', 'DESC']], // Mais recente primeiro
    });
  }

  // --- 3. CRUD de Medidas Físicas (Progresso Manual) ---
  
  async createMedida(data: CreateMedidaDto, usuarioId: string): Promise<MedidaFisica> {
    return this.medidaFisicaModel.create({ ...data, usuarioId } as unknown as CreationAttributes<MedidaFisica>);
  }

  async findAllMedidas(usuarioId: string): Promise<MedidaFisica[]> {
    return this.medidaFisicaModel.findAll({
      where: { usuarioId },
      order: [['dataRegistro', 'DESC']],
    });
  }
  
  async removeMedida(medidaId: string, usuarioId: string): Promise<void> {
      const result = await this.medidaFisicaModel.destroy({
          where: { id: medidaId, usuarioId }, // Garante que apenas o dono possa deletar
      });
      if (result === 0) {
          throw new NotFoundException(`Medida com ID ${medidaId} não encontrada ou não pertence ao usuário.`);
      }
  }

  // --- 4. Queries de Estatísticas e Comparação (Para Módulo Relatórios/Service) ---
  
  async getPerformanceStats(usuarioId?: string): Promise<any> {
      const sequelize: Sequelize = this.progressoModel.sequelize as Sequelize; 
      
      const whereClause = usuarioId 
          ? `WHERE p.usuario_id = :usuarioId AND p.status = 'CONCLUIDO'` 
          : `WHERE p.status = 'CONCLUIDO'`; 
      
      const groupByClause = usuarioId ? `GROUP BY p.usuario_id` : ''; 

      const replacements = usuarioId ? { usuarioId } : {}; 

      const result = await sequelize.query(
          `
          SELECT 
              COUNT(p.id) AS "sessoesTotais",
              SUM(p.duracao_segundos) AS "tempoTotalSegundos",
              COALESCE(SUM(pe.series_feitas), 0) AS "totalSeriesFeitas"
          FROM progresso p
          LEFT JOIN progresso_exercicios pe ON p.id = pe.progresso_id
          ${whereClause} 
          ${groupByClause} 
          `,
          {
              replacements, 
              type: 'SELECT',
              raw: true,
          }
      );

      if (!usuarioId) {
          return {
              sessoesTotais: result.reduce((sum: number, row: any) => sum + parseInt(row.sessoesTotais), 0),
              tempoTotalSegundos: result.reduce((sum: number, row: any) => sum + parseInt(row.tempoTotalSegundos), 0),
              totalSeriesFeitas: result.reduce((sum: number, row: any) => sum + parseInt(row.totalSeriesFeitas), 0),
          };
      }

      return result[0] || {};
  }
  
  async getLatestMedidas(usuarioId?: string): Promise<MedidaFisica[]> {
      const whereCondition: any = {};
      if (usuarioId) {
          whereCondition.usuarioId = usuarioId;
      } else {
          return []; 
      }

      return this.medidaFisicaModel.findAll({
          where: whereCondition, 
          order: [['dataRegistro', 'DESC']],
          limit: 5,
      });
  }
}