import { Controller, Post, Get, Put, Patch, Delete, Body, HttpCode, HttpStatus, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport'; 
import { UsuarioService } from './service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto'; // será criado
import { Usuario, Nivel } from './entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { TipoUsuario } from '../../common/enums/tipo-usuario.enum';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Usuários') // Etiqueta no Swagger
@ApiBearerAuth()
@Controller('usuarios')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // 1. POST /usuarios (Criar usuário)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um novo usuário no sistema (Aluno ou Profissional).' })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuário criado com sucesso.', 
    type: Usuario 
  })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado.' })
  async create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.create(createUsuarioDto);
  }
  
  // 2. GET /usuarios?nome&genero&page
  @Get()
  @Roles(TipoUsuario.ADMIN, TipoUsuario.PROFISSIONAL) // Protege para que apenas admins e profissionais listem todos
  @ApiOperation({ summary: 'Lista usuários com filtros e paginação.' })
  @ApiQuery({ name: 'nome', required: false })
  @ApiQuery({ name: 'genero', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiResponse({ status: 200, description: 'Lista de usuários paginada.' })
  async findAll(@Query('nome') nome: string, @Query('genero') genero: string, @Query('page') page: number): Promise<any> {
      return { message: "Listagem de usuários", filters: { nome, genero, page } }; 
  }

  // 3. GET /usuarios/:id (Visualizar usuário)
  @Get(':id')
  @ApiOperation({ summary: 'Visualiza o perfil detalhado de um usuário.' })
  @ApiResponse({ status: 200, type: Usuario })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async findOne(@Param('id') id: string): Promise<Usuario> {
    return { id, message: "Detalhes do Usuário/Perfil" } as unknown as Usuario;
  }

  // 4. PUT /usuarios/:id (Editar usuário)
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza todas as informações do usuário.' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    // Implementação de atualização completa (A ser desenvolvida no service)
    return { id, ...updateUsuarioDto, message: "Atualização Completa" } as unknown as Usuario;
  }
  
  // 5. PATCH /usuarios/:id/foto (Atualizar foto)
  // Seria melhor usar um DTO específico ou um interceptor de upload de arquivo aqui, mas mantemos o path para o escopo.
  @Patch(':id/foto')
  @ApiOperation({ summary: 'Atualiza a foto de perfil do usuário.' })
  @ApiResponse({ status: 200, description: 'Foto atualizada.' })
  async updateFoto(@Param('id') id: string): Promise<any> {
    return { id, message: "Foto atualizada" };
  }
  
  // 6. PATCH /usuarios/:id/capa (Atualizar capa)
  @Patch(':id/capa')
  @ApiOperation({ summary: 'Atualiza a imagem de capa do perfil.' })
  @ApiResponse({ status: 200, description: 'Capa atualizada.' })
  async updateCapa(@Param('id') id: string): Promise<any> {
    return { id, message: "Capa atualizada" };
  }

  // 7. DELETE /usuarios/:id (Excluir usuário)
  @Delete(':id')
  @Roles(TipoUsuario.ADMIN)
  @ApiOperation({ summary: 'Exclui um usuário (Apenas Administradores).' })
  @ApiResponse({ status: 204, description: 'Usuário excluído com sucesso.' })
  @ApiResponse({ status: 403, description: 'Apenas Administradores podem excluir usuários.' })
  async remove(@Param('id') id: string): Promise<void> {
    return; // Retorna status 204 (No Content)
  }
  
  // 8. GET /usuarios/:id/conquistas (Listar conquistas)
  @Get(':id/conquistas')
  @ApiOperation({ summary: 'Lista as conquistas obtidas pelo usuário.' })
  async getConquistas(@Param('id') id: string): Promise<any> {
    return { id, message: "Lista de Conquistas" };
  }
}