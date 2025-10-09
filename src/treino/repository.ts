import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Treino } from './entity';
import { TreinoExercicio } from './treino-exercicio.entity';
import { CreateTreinoDto, TreinoItemDto } from './dto/create-treino.dto';
import { Exercicio } from '../exercicio/entity';
import { Usuario } from '../usuario/entity';

@Injectable()
export class TreinoRepository {
  constructor(
    @InjectModel(Treino)
    private readonly treinoModel: typeof Treino,
    @InjectModel(TreinoExercicio)
    private readonly treinoExercicioModel: typeof TreinoExercicio,
  ) {}

  // --- CRUD Básico ---

  /**
   * Cria o Treino e todos os seus itens (transacionalmente).
   * @param data Dados do treino.
   * @param criadoPorId ID do usuário que está criando o treino.
   */
  async create(data: CreateTreinoDto & { isTemplate: boolean, criadoPorId: string }): Promise<Treino> {
    
    // 1. Cria o registro principal do Treino
    const novoTreino = await this.treinoModel.create(data as Treino);

    // 2. Mapeia os itens do DTO para a tabela de junção (TreinoExercicio)
    const itens = data.itens.map(item => ({
      ...item,
      treinoId: novoTreino.id,
    }));

    // 3. Cria todos os itens de prescrição em lote
    await this.treinoExercicioModel.bulkCreate(itens as TreinoExercicio[]);

    // 4. Retorna o objeto completo com os itens
    return this.findById(novoTreino.id);
  }

  /**
   * Busca um treino pelo ID, incluindo os exercícios e a prescrição.
   */
  async findById(id: string): Promise<Treino> {
    const treino = await this.treinoModel.findByPk(id, {
      include: [
        {
          model: TreinoExercicio,
          as: 'itens', // Relação HasMany
          include: [{ model: Exercicio, attributes: ['id', 'nome', 'grupoMuscular', 'videoUrl'] }],
        },
      ],
      order: [[{ model: TreinoExercicio, as: 'itens' }, 'ordem', 'ASC']],
    });
    if (!treino) {
      throw new NotFoundException(`Treino com ID ${id} não encontrado.`);
    }
    return treino;
  }
  
  /**
   * 2. Remove todos os itens (TreinoExercicio) de um Treino.
   */
  async removeItens(treinoId: string): Promise<void> {
    await this.treinoExercicioModel.destroy({ where: { treinoId } });
  }

  /**
   * SINCRONIZAÇÃO DE ITENS
   * Sincroniza os itens de prescrição: remove os antigos e insere os novos em lote.
   */
  async syncItens(treinoId: string, itens: any[]): Promise<void> {
    
    // 1. Remove os antigos
    await this.treinoExercicioModel.destroy({ where: { treinoId } });

    // 2. Cria os novos
    await this.treinoExercicioModel.bulkCreate(itens as any);
  }

  /**
   * 3. Atualiza o Treino principal (sem os itens).
   */
  async update(treinoId: string, data: Partial<Treino>): Promise<Treino> {
    const treino = await this.findById(treinoId);
    
    // Usamos 'as any' para contornar a tipagem estrita do DTO/Partial
    await treino.update(data as any); 
    return treino;
  }

  /**
   * 4. Remove o Treino principal e seus itens associados.
   */
  async remove(treinoId: string): Promise<void> {
    // Nota: Se a FK for ON DELETE CASCADE, remover o Treino principal já remove os itens.
    // Mas faremos a exclusão explícita para robustez.
    
    await this.removeItens(treinoId); // Remove os itens primeiro
    const result = await this.treinoModel.destroy({ where: { id: treinoId } });
    
    if (result === 0) {
        throw new NotFoundException(`Treino com ID ${treinoId} não encontrado para exclusão.`);
    }
  }
  
  /**
   * 5. Lista Treinos com filtros e paginação (GET /treinos).
   */
  async findAll(query: any): Promise<{ count: number, rows: Treino[] }> {
    const limit = query.limit || 10;
    const offset = ((query.page || 1) - 1) * limit;

    const whereCondition: any = {};
    
    // Filtro por Nível
    if (query.nivel) {
        whereCondition.nivel = query.nivel;
    }
    
    // Filtro por Criador/Usuário (para treinos personalizados)
    if (query.usuarioId) {
        whereCondition.criadoPorId = query.usuarioId;
    } else {
        // Se nenhum usuarioId for especificado, lista apenas templates públicos (lógica de negócio)
        whereCondition.isTemplate = true; 
    }

    return this.treinoModel.findAndCountAll({
      where: whereCondition,
      include: [
        { model: TreinoExercicio, as: 'itens' }, // Inclui os itens de prescrição
        { model: Usuario, as: 'criador', attributes: ['nome', 'tipo'] }, // Inclui o criador
      ],
      limit: limit,
      offset: offset,
      order: [['nome', 'ASC']],
    });
  }

  /**
   * Adiciona um novo item (exercício com prescrição) a um treino existente.
   */
  async adicionarItem(treinoId: string, item: TreinoItemDto): Promise<TreinoExercicio> {
    const itemCriado = await this.treinoExercicioModel.create({
      ...item,
      treinoId,
    } as TreinoExercicio);

    return itemCriado;
  }
  
  /**
   * Remove um exercício específico da prescrição de um treino (tabela TreinoExercicio).
   */
  async removeTreinoItem(treinoId: string, exercicioId: string): Promise<number> {
    return this.treinoExercicioModel.destroy({
      where: { treinoId, exercicioId },
    });
  }
}