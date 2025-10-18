import { Injectable } from '@nestjs/common';
import { LembreteRepository } from './repository';
import { CreateLembreteDto } from './dto/create-lembrete.dto';
import { UpdateLembreteDto } from './dto/update-lembrete.dto';
import { FindAllLembretesDto } from './dto/find-all-lembretes.dto';
import { Lembrete } from './entity';

@Injectable()
export class LembreteService {
    constructor(
        private readonly lembreteRepository: LembreteRepository,
        // Futura injeção do QueueService (Bônus Filas)
    ) {}

    // --- CRUD e Lógica de Filas (Bônus) ---

    async create(createLembreteDto: CreateLembreteDto, usuarioId: string): Promise<Lembrete> {
        // LÓGICA BÔNUS (FUTURA): Enfileirar o agendamento
        // if (this.queueService) {
        //   const job = await this.queueService.addLembreteJob(createLembreteDto);
        //   createLembreteDto.jobId = job.id; 
        // }
        
        return this.lembreteRepository.create(createLembreteDto, usuarioId);
    }

    async findAll(usuarioId: string, queryDto: FindAllLembretesDto): Promise<any> {
        // Conversão explícita de string para booleano
        const ativoFinal: boolean | undefined = 
            queryDto.ativo === 'true' ? true : 
            queryDto.ativo === 'false' ? false : 
            undefined; // Se não for 'true' ou 'false', é ignorado
            
        const { ativo, ...restOfQuery } = queryDto;
        // Chama o Repository com o valor booleano puro
        const { count, rows } = await this.lembreteRepository.findAll(usuarioId, { 
            ...restOfQuery, 
            ativo: ativoFinal 
        });
        
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
    
    async findOne(id: string, usuarioId: string): Promise<Lembrete> {
        return this.lembreteRepository.findById(id, usuarioId);
    }
    
    async update(id: string, usuarioId: string, updateLembreteDto: UpdateLembreteDto): Promise<Lembrete> {
        // LÓGICA BÔNUS (FUTURA): Atualizar o Job na fila se o horário/dia mudar.
        return this.lembreteRepository.update(id, usuarioId, updateLembreteDto);
    }

    async remove(id: string, usuarioId: string): Promise<void> {
        // LÓGICA BÔNUS (FUTURA): Cancelar o Job na fila antes de deletar o registro.
        await this.lembreteRepository.remove(id, usuarioId);
    }
}