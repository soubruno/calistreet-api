import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Profissional } from './entity';
import { Op } from 'sequelize';
import { UpdateProfissionalDto } from './dto/update-profissional.dto';
import { Usuario } from '../usuario/entity';
import { FindAllProfissionaisDto } from './dto/find-all-profissionais.dto';

@Injectable()
export class ProfissionalRepository {
  constructor(
    @InjectModel(Profissional)
    private readonly profissionalModel: typeof Profissional,
  ) {}

  // Busca simples de profissional por ID de usuário (necessário para o service)
  async findByUsuarioId(usuarioId: string): Promise<Profissional> {
    const profissional = await this.profissionalModel.findByPk(usuarioId);
    if (!profissional) {
      throw new NotFoundException(`Profissional não encontrado.`);
    }
    return profissional;
  }
  
  // Cria o registro específico do profissional
  async create(data: Profissional): Promise<Profissional> {
    return this.profissionalModel.create(data as Profissional);
  }

  // Listagem
  async findAll(queryDto: FindAllProfissionaisDto): Promise<{ count: number, rows: Profissional[] }> { // <<< TIPO ALTERADO
    const limit = queryDto.limit || 10;
    const offset = ((queryDto.page || 1) - 1) * limit;

    const whereCondition: any = {};
        
    // Filtro por CIDADE
    if (queryDto.cidade) {
        whereCondition.cidade = { [Op.iLike]: `%${queryDto.cidade}%` };
    }
        
    // Filtro por ESPECIALIDADE (NOVO FILTRO)
    if (queryDto.especialidade) {
        whereCondition.especialidade = { [Op.iLike]: `%${queryDto.especialidade}%` };
    }
        
    // A query busca na tabela Profissional e inclui o Usuário
    return this.profissionalModel.findAndCountAll({
        where: whereCondition,
            include: [{ 
            model: Usuario, 
            // Seleciona apenas nome e email do Usuário para o retorno
            attributes: ['nome', 'email'] 
        }], 
        limit,
        offset,
        // Seleciona os atributos específicos do Profissional
        attributes: ['usuarioId', 'registroCREF', 'especialidade', 'cidade'] 
    });
}
  async update(usuarioId: string, data: UpdateProfissionalDto): Promise<Profissional> {
    const profissional = await this.profissionalModel.findByPk(usuarioId);
    
    if (!profissional) {
        throw new NotFoundException(`Profissional com ID ${usuarioId} não encontrado.`);
    }

    await profissional.update(data as unknown as object); 
    return profissional;
  }
}