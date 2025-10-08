// src/profissional/service.ts

import { Injectable, ConflictException, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsuarioService } from '../usuario/service'; 
import { CreateProfissionalDto } from './dto/create-profissional.dto';
import { ProfissionalRepository } from './repository';
import { TipoUsuario } from '../usuario/entity';
import { UpdateProfissionalDto } from './dto/update-profissional.dto';
import { FindAllProfissionaisDto } from './dto/find-all-profissionais.dto';

@Injectable()
export class ProfissionalService {
    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly profissionalRepository: ProfissionalRepository,
    ) {}

    /**
     * 1. Cria a conta de Usuário (tipo PROFISSIONAL) e o registro na tabela Profissionais.
     */
    async create(createProfissionalDto: CreateProfissionalDto): Promise<any> {
        
        // 1. Cria a conta base do usuário (e faz o hash da senha)
        // A checagem de email duplicado é feita dentro do usuarioService.create
        const novoUsuario = await this.usuarioService.create({
            ...createProfissionalDto.usuario,
            tipo: TipoUsuario.PROFISSIONAL, // Garante que o tipo seja PROFISSIONAL
        });

        // 2. Cria o registro específico do profissional, usando o ID do novo usuário
        const novoProfissional = await this.profissionalRepository.create({
            ...createProfissionalDto,
            usuarioId: novoUsuario.id, // Liga o registro à conta base
        } as any);

        // Retorna a união dos dados
        return {
            ...novoUsuario,
            ...novoProfissional.toJSON(),
        };
    }
    
    /**
     * 2. Lista profissionais com filtros e paginação (GET /profissionais).
     */
    async findAll(queryDto: FindAllProfissionaisDto): Promise<any> {
        // A lógica de paginação e filtro é delegada ao Repository
        const { count, rows } = await this.profissionalRepository.findAll(queryDto);

        const page = queryDto.page || 1;
        const limit = queryDto.limit || 10;
        
        // A lógica de formatação da resposta paginada
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
     * 3. Busca um profissional pelo ID do usuário (GET /profissionais/:id).
     */
    async findOne(usuarioId: string): Promise<any> {
        // 1. Busca os dados COMPLETO do usuário base (UsuarioService garante que a senha é excluída)
        const usuarioBase = await this.usuarioService.findOne(usuarioId); 
    
        // 2. Busca o registro do Profissional (sem incluir o Usuario, para evitar o aninhamento)
        const profissionalRegistro = await this.profissionalRepository.findByUsuarioId(usuarioId);
    
        // Apenas extrai os atributos do profissionalRegistro, que contêm o usuarioId
        const { usuario, ...profissionalAtributos } = profissionalRegistro.toJSON();
    
        // 3. Retorna a união dos dados (sem o objeto 'usuario' aninhado)
        return {
         ...usuarioBase.toJSON(), // Dados base (seguros)
         ...profissionalAtributos, // Dados do registro CREF, especialidade, etc.
        };
    }

    /**
     * 4. Atualiza os dados do profissional e, opcionalmente, os dados da conta de usuário (PUT).
     */
    async update(usuarioId: string, updateProfissionalDto: UpdateProfissionalDto): Promise<any> {
        // 1. Atualizar a tabela base (Usuario) se houver dados de usuário no DTO
        if (updateProfissionalDto.usuario) {
            // O UsuarioService cuida do hash de senha, se for enviado, e da validação
            await this.usuarioService.update(usuarioId, updateProfissionalDto.usuario);
        }

        // 2. Atualizar a tabela específica (Profissional)
        // O Repository trata o NotFoundException
        const updatedProfissional = await this.profissionalRepository.update(
            usuarioId, 
            updateProfissionalDto
        );
        
        // 3. Retorna o objeto completo
        const usuarioAtualizado = await this.usuarioService.findOne(usuarioId);

        return {
            ...usuarioAtualizado.toJSON(),
            ...updatedProfissional.toJSON(),
        };
    }
    
    /**
     * 5. Exclui o registro do profissional e a conta de usuário (DELETE).
     */
    async remove(usuarioId: string): Promise<void> {
        // CRÍTICO: Excluir a conta base do usuário. O Sequelize deve lidar com o cascade delete,
        // mas a remoção da conta principal é a ação essencial.
        
        // 1. Garante que o registro do profissional exista (ou lança 404)
        await this.profissionalRepository.findByUsuarioId(usuarioId); 
        
        // 2. Exclui a conta base de USUARIO (o que deve, idealmente, remover o registro Profissional via Foreign Key).
        // Se a FK for configurada como CASCADE, a linha abaixo resolve o problema.
        await this.usuarioService.remove(usuarioId); 
        
        // Se a FK não for CASCADE, você deve chamar profissionalRepository.remove(usuarioId) primeiro.
        // Assumindo a abordagem de CASCADE (mais limpa) ou que o usuárioService.remove bastará.
    }
    
    /**
     * 6. Marca o certificado como verificado (PATCH /verificado).
     */
    async markVerified(usuarioId: string): Promise<any> {
        // Lógica de negócio: Apenas Admins podem chamar isso (validado no Controller/Guard).
        
        // Atualiza apenas o campo 'certificadoVerificado' para true.
        const updatedProfissional = await this.profissionalRepository.update(usuarioId, {
            certificadoVerificado: true,
        } as UpdateProfissionalDto);
        
        // Busca os dados completos para retorno
        const usuarioBase = await this.usuarioService.findOne(usuarioId);
        
        return {
            ...usuarioBase.toJSON(),
            ...updatedProfissional.toJSON(),
        };
    }
}