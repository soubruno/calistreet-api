import { Injectable, NotFoundException, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { TreinoRepository } from './repository';
import { CreateTreinoDto, TreinoItemDto } from './dto/create-treino.dto';
import { UpdateTreinoDto } from './dto/update-treino.dto';
import { ExercicioService } from '../exercicio/service';
import { Treino } from './entity';
import { UsuarioService } from '../usuario/service';
import { TipoUsuario } from '../common/enums/tipo-usuario.enum';

@Injectable()
export class TreinoService {
    constructor(
        private readonly treinoRepository: TreinoRepository,
        private readonly exercicioService: ExercicioService,
        private readonly usuarioService: UsuarioService,         
    ) {}

    // --- CRUD e Lógica de Criação ---

    async create(createTreinoDto: CreateTreinoDto, criadoPorId: string): Promise<Treino> {
        
        // 1. Validação de Regra de Negócio: Garante que todos os exercícios existam
        const exercicioIds = createTreinoDto.itens.map(item => item.exercicioId);
        
        for (const id of exercicioIds) {
            try {
                await this.exercicioService.findOne(id); 
            } catch (e) {
                throw new BadRequestException(`O exercício com ID ${id} é inválido ou não existe.`);
            }
        }
        // 2. Checagem de Permissão para criar Template
        const usuarioLogado = await this.usuarioService.findOne(criadoPorId);
        
        let isTemplate = false;
        
        // Regra de Negócio: Apenas ADMIN ou PROFISSIONAL pode criar templates
        if (createTreinoDto.isTemplate && 
            (usuarioLogado.tipo === TipoUsuario.ADMIN || usuarioLogado.tipo === TipoUsuario.PROFISSIONAL)) {
            isTemplate = true;
        }
        
        // 3. Delega a criação transacional
        return this.treinoRepository.create({
            ...createTreinoDto,
            isTemplate: isTemplate,
            criadoPorId,
        });
    }
    
    async findOne(id: string): Promise<Treino> {
        return this.treinoRepository.findById(id);
    }

    /**
     * 3. Atualiza o Treino e seus Itens (PUT /treinos/:id).
     */
    async update(treinoId: string, data: UpdateTreinoDto, usuarioLogadoId: string): Promise<Treino> {
        
        // 1. Checagem de Permissão de Edição
        const treinoExistente = await this.treinoRepository.findById(treinoId);
        const usuarioLogado = await this.usuarioService.findOne(usuarioLogadoId);

        // Regra de Negócio: Somente o criador OU um ADMIN pode editar
        const isCriador = treinoExistente.criadoPorId === usuarioLogadoId;
        const isAdmin = usuarioLogado.tipo === TipoUsuario.ADMIN;

        if (!isCriador && !isAdmin) {
            throw new UnauthorizedException('Você não tem permissão para editar este treino.');
        }

        // 2. Validação de Regra de Negócio: Se houver itens novos, validar IDs
        if (data.itens) {
            const exercicioIds = data.itens.map(item => item.exercicioId);
            for (const id of exercicioIds) {
                try {
                    await this.exercicioService.findOne(id); 
                } catch (e) {
                    throw new BadRequestException(`O exercício com ID ${id} é inválido ou não existe.`);
                }
            }
            
            // 3. Atualização dos Itens (Transacional): Exclui os antigos e cria os novos
            await this.treinoRepository.removeItens(treinoId);
            const itens = data.itens.map(item => ({
                ...item,
                treinoId,
            }));
        await this.treinoRepository.syncItens(treinoId, itens);
        }
        
        // 4. Atualização dos Dados Principais (Treino)
        // Remove a propriedade 'itens' do objeto de atualização para não quebrar o update principal
        const { itens, ...treinoData } = data; 
        return this.treinoRepository.update(treinoId, treinoData);
    }

    /**
     * 4. Remove o Treino e seus Itens (DELETE /treinos/:id).
     */
    async remove(treinoId: string, usuarioLogadoId: string): Promise<void> {
        const treinoExistente = await this.treinoRepository.findById(treinoId);
        const usuarioLogado = await this.usuarioService.findOne(usuarioLogadoId);

        // Checagem de Permissão de Exclusão
        const isCriador = treinoExistente.criadoPorId === usuarioLogadoId;
        const isAdmin = usuarioLogado.tipo === TipoUsuario.ADMIN;

        if (!isCriador && !isAdmin) {
            throw new UnauthorizedException('Você não tem permissão para excluir este treino.');
        }
        
        // Delega a exclusão (que remove itens e o treino principal)
        await this.treinoRepository.remove(treinoId);
    }
    
    /**
     * 5. Lista Treinos (GET /treinos).
     */
    async findAll(query: any): Promise<any> {
        const { count, rows } = await this.treinoRepository.findAll(query);

        // Lógica de Paginação
        const page = query.page || 1;
        const limit = query.limit || 10;
        
        return {
            data: rows,
            total: count,
            page: page,
            limit: limit,
            totalPages: Math.ceil(count / limit),
            hasNextPage: page * limit < count,
        };
    }

    /**
   * Adiciona um novo exercício à prescrição de um treino existente (POST /treinos/:id/exercicios).
   */
    async adicionarExercicio(treinoId: string, itemDto: TreinoItemDto, usuarioLogadoId: string): Promise<Treino> {
        
        // 1. Validação de Permissão (Autoria ou Admin)
        const treinoExistente = await this.treinoRepository.findById(treinoId);
        const usuarioLogado = await this.usuarioService.findOne(usuarioLogadoId);
        
        const isCriador = treinoExistente.criadoPorId === usuarioLogadoId;
        const isAdmin = usuarioLogado.tipo === TipoUsuario.ADMIN;

        if (!isCriador && !isAdmin) {
            throw new ForbiddenException('Você não tem permissão para modificar este treino.');
        }

        // 2. Validação: O Exercício existe?
        try {
            await this.exercicioService.findOne(itemDto.exercicioId); 
        } catch (e) {
            throw new BadRequestException(`O exercício com ID ${itemDto.exercicioId} é inválido ou não existe.`);
        }

        // 3. Persistência: Adiciona o item
        await this.treinoRepository.adicionarItem(treinoId, itemDto);

        // 4. Retorna o Treino completo e atualizado
        return this.treinoRepository.findById(treinoId);
    }

    /**
     * Remove um exercício específico da prescrição (DELETE /treinos/:id/exercicios/:exercicioId).
    */
    async removeExercicio(treinoId: string, exercicioId: string, usuarioLogadoId: string): Promise<void> {
    
        // 1. Checagem de Permissão (Reutiliza a lógica de autoria/Admin)
        const treinoExistente = await this.treinoRepository.findById(treinoId);
        const usuarioLogado = await this.usuarioService.findOne(usuarioLogadoId);

        const isCriador = treinoExistente.criadoPorId === usuarioLogadoId;
        const isAdmin = usuarioLogado.tipo === TipoUsuario.ADMIN;

        if (!isCriador && !isAdmin) {
            throw new ForbiddenException('Você não tem permissão para modificar este treino.');
        }
        
        // 2. Delega a exclusão ao Repository
        const result = await this.treinoRepository.removeTreinoItem(treinoId, exercicioId);

        if (result === 0) {
            throw new NotFoundException('O item de prescrição não foi encontrado.');
        }
    }
}