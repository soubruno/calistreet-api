import { Injectable } from '@nestjs/common';
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
            tipo: TipoUsuario.PROFISSIONAL,
        });

        // 2. Cria o registro específico do profissional, usando o ID do novo usuário
        const novoProfissional = await this.profissionalRepository.create({
            ...createProfissionalDto,
            usuarioId: novoUsuario.id,
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
        
        const usuarioBase = await this.usuarioService.findOne(usuarioId); 
    
        const profissionalRegistro = await this.profissionalRepository.findByUsuarioId(usuarioId);
    
        const { usuario, ...profissionalAtributos } = profissionalRegistro.toJSON();
    
        return {
         ...usuarioBase.toJSON(), // Dados base (seguros)
         ...profissionalAtributos, // Dados do registro CREF, especialidade, etc.
        };
    }

    /**
     * 4. Atualiza os dados do profissional e, opcionalmente, os dados da conta de usuário (PUT).
     */
    async update(usuarioId: string, updateProfissionalDto: UpdateProfissionalDto): Promise<any> {
        
        if (updateProfissionalDto.usuario) {
            await this.usuarioService.update(usuarioId, updateProfissionalDto.usuario);
        }

        const updatedProfissional = await this.profissionalRepository.update(
            usuarioId, 
            updateProfissionalDto
        );
        
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

        await this.profissionalRepository.findByUsuarioId(usuarioId); 
        
        await this.usuarioService.remove(usuarioId);
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
        
        const usuarioBase = await this.usuarioService.findOne(usuarioId);
        
        return {
            ...usuarioBase.toJSON(),
            ...updatedProfissional.toJSON(),
        };
    }
}