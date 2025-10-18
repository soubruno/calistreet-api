import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ConquistaRepository } from './repository';
import { CreateConquistaDto } from './dto/create-conquista.dto';
import { UpdateConquistaDto } from './dto/update-conquista.dto';
import { FindAllConquistasDto } from './dto/find-all-conquistas.dto';
import { Conquista } from './entity';
import { UsuarioService } from '../usuario/service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ConquistaService {
    constructor(
        private readonly conquistaRepository: ConquistaRepository,
        private readonly usuarioService: UsuarioService,
    ) {}

    // --- 1. CRUD do Catálogo (Restrito a ADMIN) ---

    async create(createConquistaDto: CreateConquistaDto, usuarioLogadoId: string): Promise<Conquista> {
        
        const usuario = await this.usuarioService.findOne(usuarioLogadoId);
        if (usuario.tipo !== 'ADMIN') {
            throw new ForbiddenException('Apenas administradores podem gerenciar o catálogo de conquistas.');
        }

        // Checagem de Conflito de Nome
        const existe = await this.conquistaRepository.findByTitulo(createConquistaDto.titulo); 
        
        if (existe) {
            throw new ConflictException(`A conquista "${createConquistaDto.titulo}" já existe.`);
        }

        return this.conquistaRepository.create(createConquistaDto);
    }

    async update(id: string, updateConquistaDto: UpdateConquistaDto, usuarioLogadoId: string): Promise<Conquista> {
        
        const usuario = await this.usuarioService.findOne(usuarioLogadoId);
        if (usuario.tipo !== 'ADMIN') {
            throw new ForbiddenException('Apenas administradores podem atualizar o catálogo de conquistas.');
        }
        
        return this.conquistaRepository.update(id, updateConquistaDto);
    }

    async remove(id: string, usuarioLogadoId: string): Promise<void> {
        
        const usuario = await this.usuarioService.findOne(usuarioLogadoId);
        if (usuario.tipo !== 'ADMIN') {
            throw new ForbiddenException('Apenas administradores podem remover conquistas.');
        }
        
        
        await this.conquistaRepository.remove(id);
    }
    
    async findAll(queryDto: FindAllConquistasDto): Promise<any> {
        return this.conquistaRepository.findAll(queryDto);
    }

    async findOne(id: string): Promise<Conquista> {
        return this.conquistaRepository.findById(id);
    }
    
    // --- 2. Lógica de Desbloqueio e Leitura (Event-Driven) ---

    /**
     * Lógica Bônus (Evento Futuro): Desbloqueia uma conquista para o usuário.
     */
    async unlock(usuarioId: string, conquistaId: string): Promise<any> {

        await this.conquistaRepository.findById(conquistaId); // Garante que a conquista existe
        
        try {
             return await this.conquistaRepository.unlockConquista(usuarioId, conquistaId);
        } catch (e) {
            // Se já tiver sido desbloqueada, o erro de chave primária duplicada será capturado.
            throw new ConflictException('Conquista já desbloqueada.');
        }
    }
    
    /**
     * GET /progresso/conquistas - Lista as conquistas obtidas pelo usuário logado.
     */
    async getUnlockedConquistas(usuarioId: string): Promise<Conquista[]> {
        return this.conquistaRepository.findUnlockedByUser(usuarioId);
    }

    @OnEvent('progresso.treino.concluido')
    async handleTreinoConcluido(payload: { usuarioId: string, sessaoId: string, duracao: number }) {
        console.log(`[EVENTO] Treino Concluído recebido para Usuário: ${payload.usuarioId}`);

        // 1. Encontre a regra "Primeira Milha" (Regra: Tipo TREINO_COMPLETO, Parâmetro: "1")
        const regraPrimeiroTreino = await this.conquistaRepository.findRegraByTipoAndParam(
            'TREINO_COMPLETO' as any,
            '1' 
        );

        if (regraPrimeiroTreino) {
            // 2. Se a regra existir, tenta desbloquear...
            try {
                await this.conquistaRepository.unlockConquista(payload.usuarioId, regraPrimeiroTreino.id);
                console.log(`Conquista '${regraPrimeiroTreino.titulo}' desbloqueada!`);
            } catch (e) {
                // Conflito (já desbloqueada), ignora.
            }
        }
    }
}