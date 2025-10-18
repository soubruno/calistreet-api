import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { ExercicioRepository } from './repository';
import { CreateExercicioDto } from './dto/create-exercicio.dto';
import { UpdateExercicioDto } from './dto/update-exercicio.dto';
import { FindAllExerciciosDto } from './dto/find-all-exercicios.dto';
import { Exercicio, GrupoMuscular, SubgrupoMuscular } from './entity';

@Injectable()
export class ExercicioService {
    constructor(
        private readonly exercicioRepository: ExercicioRepository,
    ) {}

    // --- CRUD Básico ---

    async create(createExercicioDto: CreateExercicioDto): Promise<Exercicio> {
        
        const existe = await this.exercicioRepository.findByName(createExercicioDto.nome); 
        
        if (existe) {
            throw new ConflictException(`O exercício "${createExercicioDto.nome}" já está cadastrado.`);
        }
        return this.exercicioRepository.create(createExercicioDto);
    }

    async findOne(id: string): Promise<Exercicio> {
        return this.exercicioRepository.findById(id);
    }
    
    async update(id: string, updateExercicioDto: UpdateExercicioDto): Promise<Exercicio> {
        return this.exercicioRepository.update(id, updateExercicioDto);
    }

    async remove(id: string): Promise<void> {
        await this.exercicioRepository.remove(id);
    }

    // --- Listagem e Favoritos ---

    async findAll(queryDto: FindAllExerciciosDto, usuarioId?: string): Promise<any> {
        const { count, rows } = await this.exercicioRepository.findAll(queryDto, usuarioId);

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
    
    async findFavoritos(usuarioId: string, queryDto: FindAllExerciciosDto): Promise<any> {
        const { count, rows } = await this.exercicioRepository.findFavoritos(usuarioId, queryDto);

        const page = queryDto.page || 1;
        const limit = queryDto.limit || 10;
        
        return {
            data: rows,
            total: count,
            page: page,
            limit: limit,
            totalPages: Math.ceil(count / count),
            hasNextPage: page * limit < count,
        };
    }
    
    async favoritar(usuarioId: string, exercicioId: string): Promise<{ success: boolean }> {
        
        await this.exercicioRepository.findById(exercicioId); 

        // 2. Cria o registro M:N (favorito)
        try {
            await this.exercicioRepository.createFavorito(usuarioId, exercicioId);
            return { success: true };
        } catch (error: any) { 
            // Verificar o nome do erro que o Sequelize retorna em runtime
            if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeForeignKeyConstraintError') {
                throw new ConflictException('Este exercício já está nos seus favoritos.');
            }
            throw error;
        }
    }
    
    async desfavoritar(usuarioId: string, exercicioId: string): Promise<void> {
        const result = await this.exercicioRepository.removeFavorito(usuarioId, exercicioId);

        if (result === 0) {
            throw new NotFoundException('O exercício não foi encontrado nos seus favoritos para ser removido.');
        }
    }

    // --- Endpoints de Listagem de Grupos ---
    // Estes endpoints apenas retornam os ENUMS (não usam o DB)
    
    async getGrupos(): Promise<string[]> {
        return Object.values(GrupoMuscular);
    }

    async getSubgrupos(grupo?: GrupoMuscular): Promise<string[]> {
        return Object.values(SubgrupoMuscular);
    }
}