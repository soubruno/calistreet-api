import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ProgressoRepository } from './repository';
import { CreateProgressoDto } from './dto/create-progresso.dto';
import { FindAllProgressoDto } from './dto/find-all-progresso.dto';
import { MedidaFisica, TipoMedida } from './medida-fisica.entity';
import { TreinoService } from '../treino/service';
import { UsuarioService } from '../usuario/service';
import { ExercicioService } from '../exercicio/service';
import { isUUID } from 'class-validator';
import { Progresso } from './entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConquistaRepository } from '../conquista/repository';

@Injectable()
export class ProgressoService {
    constructor(
        private readonly progressoRepository: ProgressoRepository,
        private readonly treinoService: TreinoService,
        private readonly usuarioService: UsuarioService,
        private readonly exercicioService: ExercicioService,
        private readonly eventEmitter: EventEmitter2,
        private readonly conquistaRepository: ConquistaRepository,
    ) {}

    // --- 1. Histórico de Sessões de Treino (Progresso) ---

    /**
     * POST /progresso - Registra uma sessão de treino concluída.
     */
    async createSessao(createProgressoDto: CreateProgressoDto, usuarioId: string): Promise<Progresso> {
        
        // Validação: Garante que todos os exercícios executados existem no catálogo
        const exercicioIds = createProgressoDto.resultadosExercicios.map(res => res.exercicioId);
        for (const id of exercicioIds) {
            if (!isUUID(id)) throw new BadRequestException(`ID de exercício ${id} inválido.`);
            try {
                await this.exercicioService.findOne(id);
            } catch (e) {
                throw new BadRequestException(`O exercício com ID ${id} não existe no catálogo.`);
            }
        }

        // Validação: Se um treinoId foi fornecido (execução de template), verifica se ele existe
        if (createProgressoDto.treinoId) {
            try {
                await this.treinoService.findOne(createProgressoDto.treinoId);
            } catch (e) {
                throw new BadRequestException(`O template de treino com ID ${createProgressoDto.treinoId} é inválido.`);
            }
        }

        // Delega a criação transacional (Sessão + Resultados) ao Repository
        const novaSessao = await this.progressoRepository.create(createProgressoDto, usuarioId);

        this.eventEmitter.emit('progresso.treino.concluido', {
            usuarioId: usuarioId,
            sessaoId: novaSessao.id,
            duracao: novaSessao.duracaoSegundos,
            status: novaSessao.status,
        });

        return novaSessao;

    }

    /**
     * GET /progresso - Lista o histórico de sessões do usuário.
     */
    async findAllSessoes(usuarioId: string, queryDto: FindAllProgressoDto): Promise<any> {
        return this.progressoRepository.findAll(usuarioId, queryDto);
    }
    
    /**
     * GET /progresso/:id - Detalhes de uma sessão de progresso.
     */
    async findOneSessao(sessaoId: string, usuarioLogadoId: string): Promise<Progresso> {
        const sessao = await this.progressoRepository.findById(sessaoId);
        
        // Permissão: Só o criador da sessão (ou ADMIN) pode ver os detalhes
        const usuarioLogado = await this.usuarioService.findOne(usuarioLogadoId);
        if (sessao.usuarioId !== usuarioLogadoId && usuarioLogado.tipo !== 'ADMIN') {
            throw new ForbiddenException('Você não tem permissão para visualizar este histórico.');
        }

        return sessao;
    }

    /**
     * DELETE /progresso/:id - Remove uma sessão de progresso.
     */
    async removeSessao(sessaoId: string, usuarioLogadoId: string): Promise<void> {
        
        // Verifica se a sessão existe e se o usuário tem permissão (dono ou Admin)
        const sessao = await this.progressoRepository.findById(sessaoId);
        const usuarioLogado = await this.usuarioService.findOne(usuarioLogadoId);

        if (sessao.usuarioId !== usuarioLogadoId && usuarioLogado.tipo !== 'ADMIN') {
            throw new ForbiddenException('Você não tem permissão para remover este histórico.');
        }

        await this.progressoRepository.removeSessao(sessaoId);
    }
    
    /**
     * PUT/PATCH /progresso/:id - Atualiza uma sessão de progresso (Permissão: Dono/Admin).
     */
    async updateSessao(sessaoId: string, updateData: any, usuarioLogadoId: string): Promise<Progresso> {
        
        // Permissão: Só o criador da sessão (ou ADMIN) pode atualizar
        const sessao = await this.progressoRepository.findById(sessaoId);
        const usuarioLogado = await this.usuarioService.findOne(usuarioLogadoId);

        if (sessao.usuarioId !== usuarioLogadoId && usuarioLogado.tipo !== 'ADMIN') {
            throw new ForbiddenException('Você não tem permissão para atualizar este histórico.');
        }
        
        return this.progressoRepository.updateSessao(sessaoId, updateData);
    }

    // --- 2. Histórico de Medidas Físicas ---
    
    /**
     * POST /progresso (Sub-rota para medidas) - Salvar progresso manual (medidas).
     */
    async createMedida(medidaData: any, usuarioId: string): Promise<MedidaFisica> {
        // Validação: Garante que o tipo de medida e a unidade são coerentes
        if (medidaData.tipo === TipoMedida.PESO && medidaData.unidade !== 'kg') {
            throw new BadRequestException('A unidade para PESO deve ser "kg".');
        }
        
        return this.progressoRepository.createMedida(medidaData, usuarioId);
    }

    /**
     * GET /progresso/medidas - Lista o histórico de medidas do usuário.
     */
    async findAllMedidas(usuarioId: string): Promise<MedidaFisica[]> {
        return this.progressoRepository.findAllMedidas(usuarioId);
    }
    
    /**
     * DELETE /progresso/medidas/:id - Remove uma medida física.
     */
    async removeMedida(medidaId: string, usuarioLogadoId: string): Promise<void> {
        await this.progressoRepository.removeMedida(medidaId, usuarioLogadoId);
    }
    
    // --- 3. Queries de Estatísticas e Comparação (Complexas) ---
    
    /**
     * GET /progresso/estatisticas - Estatísticas de performance (volume, tempo, etc.).
     */
    async getEstatisticas(usuarioId?: string): Promise<any> {

        const estatisticas = await this.progressoRepository.getPerformanceStats(usuarioId);
        const medidas = await this.progressoRepository.getLatestMedidas(usuarioId);
        
        return {
            ...estatisticas,
            medidasRecentes: medidas,
        };
    }
    
    /**
     * GET /progresso/comparar - Compara o progresso (ex: peso atual vs. 3 meses atrás).
     */
    async compararProgresso(usuarioId: string): Promise<any> {

        const medidas = await this.progressoRepository.findAllMedidas(usuarioId);
        const pesoAtual = medidas.find(m => m.tipo === TipoMedida.PESO);

        if (!pesoAtual) {
            return { mensagem: 'Dados de peso insuficientes para comparação.' };
        }
        
        const tresMesesAtras = new Date();
        tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);

        const pesoAnterior = medidas.find(m => 
            m.tipo === TipoMedida.PESO && new Date(m.dataRegistro) <= tresMesesAtras
        );

        const diferencaPeso = pesoAtual.valor - (pesoAnterior?.valor || pesoAtual.valor);

        return {
            pesoAtual: pesoAtual.valor,
            pesoAnterior: pesoAnterior?.valor,
            diferencaKg: diferencaPeso.toFixed(2),
            mensagem: `Você ${diferencaPeso > 0 ? 'ganhou' : 'perdeu'} ${Math.abs(diferencaPeso).toFixed(2)} kg nos últimos 3 meses.`
        };
    }

    /**
     * GET /progresso/conquistas - Lista as conquistas obtidas (Integração futura).
     */
    async getConquistas(usuarioId: string): Promise<any> {
        
        const conquistas = await this.conquistaRepository.findUnlockedByUser(usuarioId);
        
        return {
            usuarioId,
            conquistasObtidas: conquistas,
            mensagem: "Sucesso na leitura das conquistas."
        };
    }
}