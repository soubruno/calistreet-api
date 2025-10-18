import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Lembrete } from './entity';
import { CreateLembreteDto } from './dto/create-lembrete.dto';
import { UpdateLembreteDto } from './dto/update-lembrete.dto';
import { FindAllLembretesDto } from './dto/find-all-lembretes.dto';

// O tipo que o Repository espera (removendo 'ativo' string e adicionando 'ativo' boolean)
type FindLembretesRepoDto = Omit<FindAllLembretesDto, 'ativo'> & {
    ativo?: boolean; // O tipo que realmente chega ao Repository
};

@Injectable()
export class LembreteRepository {
  constructor(
    @InjectModel(Lembrete)
    private readonly lembreteModel: typeof Lembrete,
  ) {}

  // --- CRUD Básico ---
  
  async create(data: CreateLembreteDto, usuarioId: string): Promise<Lembrete> {
    return this.lembreteModel.create({ ...data, usuarioId } as Lembrete);
  }

  async findById(id: string, usuarioId: string): Promise<Lembrete> {
    const lembrete = await this.lembreteModel.findOne({ where: { id, usuarioId } });
    if (!lembrete) {
      throw new NotFoundException(`Lembrete com ID ${id} não encontrado.`);
    }
    return lembrete;
  }
  
  async update(id: string, usuarioId: string, data: UpdateLembreteDto): Promise<Lembrete> {
    const lembrete = await this.findById(id, usuarioId);
    await lembrete.update(data as Lembrete);
    return lembrete;
  }

  async remove(id: string, usuarioId: string): Promise<void> {
    const result = await this.lembreteModel.destroy({ where: { id, usuarioId } });
    if (result === 0) {
        throw new NotFoundException(`Lembrete com ID ${id} não encontrado para exclusão.`);
    }
  }

  // --- Listagem e Filtros ---

  async findAll(usuarioId: string, queryDto: FindLembretesRepoDto): Promise<any> {
    const limit = queryDto.limit || 10;
    const offset = ((queryDto.page || 1) - 1) * limit;

    const whereCondition: any = { usuarioId }; 
    
    if (queryDto.diaSemana) {
        whereCondition.diaSemana = queryDto.diaSemana;
    }
    if (queryDto.hora) {
        whereCondition.hora = queryDto.hora;
    }
    if (queryDto.ativo !== undefined) {
        whereCondition.ativo = queryDto.ativo;
    }

    return this.lembreteModel.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      order: [['hora', 'ASC'], ['diaSemana', 'ASC']],
    });
  }
}