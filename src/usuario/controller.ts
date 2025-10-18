import { Controller, Post, Get, Put, Patch, Delete, Body, HttpCode, HttpStatus, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsuarioService } from './service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entity';
import { Roles } from '../common/decorators/roles.decorator';
import { TipoUsuario } from '../common/enums/tipo-usuario.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { FindAllUsuariosDto } from './dto/find-all-usuarios.dto'; 

@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('usuarios')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
  ) {}

  // 1. POST /usuarios 
  // Endpoint: POST /usuarios (Registro/Criação de Conta)
  @UseGuards()
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(TipoUsuario.ADMIN, TipoUsuario.PROFISSIONAL)
  @ApiOperation({ summary: 'Lista usuários com filtros e paginação.' })
  @ApiResponse({ status: 200, description: 'Lista de usuários paginada.' })
  async findAll(@Query() query: FindAllUsuariosDto): Promise<any> {
      return this.usuarioService.findAll(query);
  }

  // 3. GET /usuarios/:id (Perfil detalhado)
  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Visualiza o perfil detalhado de um usuário.' })
  @ApiResponse({ status: 200, type: Usuario })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async findOne(@Param('id') id: string): Promise<Usuario> {
    return this.usuarioService.findOne(id);
  }
  
  // 4. PUT /usuarios/:id (Editar informações)
  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Atualiza todas as informações do usuário.' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.update(id, updateUsuarioDto);
  }
  
  // 5. PATCH /usuarios/:id/foto (Atualizar foto)
  @Patch(':id/foto')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Atualiza a foto de perfil do usuário.' })
  @ApiResponse({ status: 200, description: 'Foto atualizada.' })
  async updateFoto(@Param('id') id: string, @Body('fotoUrl') fotoUrl: string): Promise<any> {
    return this.usuarioService.updateFoto(id, fotoUrl);
  }
  
  // 6. PATCH /usuarios/:id/capa (Atualizar capa)
  @Patch(':id/capa')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Atualiza a imagem de capa do perfil.' })
  @ApiResponse({ status: 200, description: 'Capa atualizada.' })
async updateCapa(@Param('id') id: string, @Body('capaUrl') capaUrl: string): Promise<any> {
  return this.usuarioService.updateCapa(id, capaUrl);
  }

  // 7. DELETE /usuarios/:id (Excluir usuário)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(TipoUsuario.ADMIN)
  @ApiOperation({ summary: 'Exclui um usuário (Apenas Administradores).' })
  @ApiResponse({ status: 204, description: 'Usuário excluído com sucesso.' })
  @ApiResponse({ status: 403, description: 'Apenas Administradores podem excluir usuários.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.usuarioService.remove(id);
  }
  
// 8. GET /usuarios/:id/conquistas (Listar conquistas)
  @Get(':id/conquistas')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Lista as conquistas obtidas pelo usuário.' })
  async getConquistas(@Param('id') id: string): Promise<any> {
    return { id, message: "Lista de Conquistas" };
  }
}