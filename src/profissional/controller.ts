import { Controller, Post, Get, Put, Patch, Delete, Body, HttpCode, HttpStatus, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProfissionalService } from './service';
import { CreateProfissionalDto } from './dto/create-profissional.dto';
import { UpdateProfissionalDto } from './dto/update-profissional.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { TipoUsuario } from '../common/enums/tipo-usuario.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { FindAllProfissionaisDto } from './dto/find-all-profissionais.dto';

@ApiTags('Profissionais') 
@ApiBearerAuth()
@Controller('profissionais')
export class ProfissionalController {
  constructor(private readonly profissionalService: ProfissionalService) {}

  // 1. POST /profissionais (Registro de Profissional)
  // A rota é pública. Usuários básicos (TipoUsuario.ALUNO) não podem criar.
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um novo profissional e a conta de usuário associada.' })
  @ApiResponse({ status: 201, description: 'Profissional registrado com sucesso.' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado.' })
  async create(@Body() createProfissionalDto: CreateProfissionalDto): Promise<any> {
    return this.profissionalService.create(createProfissionalDto);
  }
  
// 2. GET /profissionais (Listagem - PROTEGIDA)
  @Get()
  @UseGuards(AuthGuard('jwt')) 
  @ApiOperation({ summary: 'Lista profissionais com filtros (cidade, especialidade) e paginação.' })
  @ApiResponse({ status: 200, description: 'Lista de profissionais paginada.' })
  async findAll(@Query() query: FindAllProfissionaisDto): Promise<any> {
      return this.profissionalService.findAll(query);
  }

  // 3. GET /profissionais/:id (Perfil detalhado)
  // Protegida para garantir que o usuário está logado.
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Visualiza o perfil detalhado de um profissional.' })
  @ApiResponse({ status: 200, description: 'Detalhes do profissional.' })
  async findOne(@Param('id') id: string): Promise<any> {
    return this.profissionalService.findOne(id);
  }
  
  // 4. PUT /profissionais/:id (Editar informações - PROTEGIDA)
  // Requisito: Apenas o próprio profissional ou ADMIN pode atualizar.
  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles(TipoUsuario.ADMIN, TipoUsuario.PROFISSIONAL) 
  @ApiOperation({ summary: 'Atualiza todas as informações do profissional e sua conta base.' })
  @ApiResponse({ status: 200, description: 'Profissional atualizado.' })
  async update(@Param('id') id: string, @Body() updateProfissionalDto: UpdateProfissionalDto): Promise<any> {
    return this.profissionalService.update(id, updateProfissionalDto);
  }
  
  // 5. GET /profissionais/:id/alunos (Listar alunos - PROTEGIDA)
  @Get(':id/alunos')
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles(TipoUsuario.ADMIN, TipoUsuario.PROFISSIONAL) // Apenas profissionais podem ver seus alunos
  @ApiOperation({ summary: 'Lista os alunos atendidos por este profissional (Apenas Profissionais/Admin).' })
  @ApiResponse({ status: 200, description: 'Lista de alunos.' })
  async findAlunos(@Param('id') id: string): Promise<any> {
      return { id, message: `Lista de alunos do profissional ${id}` };
  }

  // 6. PATCH /profissionais/:id/verificado (Verificar Certificado - PROTEGIDA)
  @Patch(':id/verificado')
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles(TipoUsuario.ADMIN) // Apenas ADMS podem verificar o CREF
  @ApiOperation({ summary: 'Marca o certificado do profissional como verificado (Apenas Administrador).' })
  @ApiResponse({ status: 200, description: 'Status de verificação atualizado.' })
  async markVerified(@Param('id') id: string): Promise<any> {
    return this.profissionalService.markVerified(id);
  }
  
  // 7. DELETE /profissionais/:id (Excluir Profissional - PROTEGIDA)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles(TipoUsuario.ADMIN) // Apenas ADMS podem excluir profissionais
  @ApiOperation({ summary: 'Exclui o registro do profissional e a conta de usuário (Apenas Administrador).' })
  @ApiResponse({ status: 204, description: 'Profissional excluído com sucesso.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.profissionalService.remove(id);
  }
}