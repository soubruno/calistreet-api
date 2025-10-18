import { Controller, Post, Get, Put, Patch, Delete, Body, HttpCode, HttpStatus, Param, UseGuards, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ExercicioService } from './service';
import { CreateExercicioDto } from './dto/create-exercicio.dto';
import { UpdateExercicioDto } from './dto/update-exercicio.dto';
import { FindAllExerciciosDto } from './dto/find-all-exercicios.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { TipoUsuario } from '../common/enums/tipo-usuario.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { GrupoMuscular, SubgrupoMuscular } from './entity';

@ApiTags('Exercícios') 
@ApiBearerAuth()
@Controller('exercicios')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ExercicioController {
  constructor(private readonly exercicioService: ExercicioService) {}
  
  // --- ENDPOINTS PROTEGIDOS POR ADMIN/PROFISSIONAL (Gerenciamento) ---

  // 1. POST /exercicios (Cadastrar exercício)
  @Post()
  @Roles(TipoUsuario.ADMIN, TipoUsuario.PROFISSIONAL)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastra um novo exercício (Apenas Admin/Profissional).' })
  async create(@Body() createExercicioDto: CreateExercicioDto) {
    return this.exercicioService.create(createExercicioDto);
  }
  
  // 2. PUT /exercicios/:id (Atualizar exercício)
  @Put(':id')
  @Roles(TipoUsuario.ADMIN, TipoUsuario.PROFISSIONAL)
  @ApiOperation({ summary: 'Atualiza um exercício existente.' })
  async update(@Param('id') id: string, @Body() updateExercicioDto: UpdateExercicioDto) {
    return this.exercicioService.update(id, updateExercicioDto);
  }
  
  // 3. PATCH /exercicios/:id (Atualização parcial)
  @Patch(':id')
  @Roles(TipoUsuario.ADMIN, TipoUsuario.PROFISSIONAL)
  @ApiOperation({ summary: 'Atualiza parcialmente um exercício (PATCH).' })
  async updatePartial(@Param('id') id: string, @Body() updateExercicioDto: UpdateExercicioDto) {
    return this.exercicioService.update(id, updateExercicioDto);
  }
  
  // 4. DELETE /exercicios/:id (Remover exercício)
  @Delete(':id')
  @Roles(TipoUsuario.ADMIN, TipoUsuario.PROFISSIONAL)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove um exercício do catálogo (Apenas Admin/Profissional).' })
  async remove(@Param('id') id: string) {
    return this.exercicioService.remove(id);
  }

  // --- ENDPOINTS PÚBLICOS (Leitura e Favoritos) ---
  
  // 5. GET /exercicios (Listagem principal com filtros e paginação)
  @Get()
  @UseGuards(AuthGuard('jwt')) // Apenas autenticado (não precisa de RolesGuard)
  @ApiOperation({ summary: 'Lista exercícios com filtros, paginação e status de favorito.' })
  async findAll(@Query() query: FindAllExerciciosDto, @Req() req: any) {
    const usuarioId = req.user.id; 
    return this.exercicioService.findAll(query, usuarioId);
  }

  // 9. GET /exercicios/favoritos (Listar exercícios favoritos)
  @Get('favoritos')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Lista os exercícios favoritos do usuário logado.' })
  async findFavoritos(@Query() query: FindAllExerciciosDto, @Req() req: any) {
    const usuarioId = req.user.id;
    return this.exercicioService.findFavoritos(usuarioId, query);
  }
  
  // 10. GET /exercicios/grupos (Listar grupos musculares)
  @Get('grupos')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Lista todos os grupos musculares principais (ex: SUPERIOR, CORE).' })
  async getGrupos() {
      return this.exercicioService.getGrupos();
  }

  // 6. GET /exercicios/:id (Detalhes de exercício)
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Detalhes de um exercício.' })
  async findOne(@Param('id') id: string) {
    return this.exercicioService.findOne(id);
  }
  
  // 7. POST /exercicios/:id/favoritar (Favoritar exercício)
  @Post(':id/favoritar')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Adiciona um exercício aos favoritos do usuário.' })
  async favoritar(@Param('id') exercicioId: string, @Req() req: any) {
    const usuarioId = req.user.id;
    return this.exercicioService.favoritar(usuarioId, exercicioId);
  }

  // 8. DELETE /exercicios/:id/favoritar (Remover dos favoritos)
  @Delete(':id/favoritar')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove um exercício dos favoritos do usuário.' })
  async desfavoritar(@Param('id') exercicioId: string, @Req() req: any) {
    const usuarioId = req.user.id;
    return this.exercicioService.desfavoritar(usuarioId, exercicioId);
  }

  // 11. GET /exercicios/grupos/:grupo (Listar subgrupos)
  @Get('grupos/:grupo')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Lista todos os subgrupos musculares (ex: PEITO, OMBRO).' })
  async getSubgrupos(@Param('grupo') grupo: GrupoMuscular) {
      return this.exercicioService.getSubgrupos(grupo);
  }
  
  // 12. GET /exercicios/grupos/:grupo/:subgrupo (Lista por subgrupo)
  @Get('grupos/:grupo/:subgrupo')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Lista exercícios por Grupo e Subgrupo (Filtro Combinado).' })
  async findByGroupAndSubgroup(
    @Param('grupo') grupo: GrupoMuscular,
    @Param('subgrupo') subgrupo: SubgrupoMuscular,
    @Query() query: FindAllExerciciosDto // Adiciona paginação e filtros
  ) {
    // Combina os filtros e chama o findAll
    return this.exercicioService.findAll({ 
        ...query, 
        grupoMuscular: grupo, 
        subgrupoMuscular: subgrupo 
    });
  }
}