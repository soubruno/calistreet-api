import { Controller, Post, Get, Put, Delete, Body, HttpCode, HttpStatus, Param, UseGuards, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ConquistaService } from './service';
import { CreateConquistaDto } from './dto/create-conquista.dto';
import { UpdateConquistaDto } from './dto/update-conquista.dto';
import { FindAllConquistasDto } from './dto/find-all-conquistas.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { TipoUsuario } from '../common/enums/tipo-usuario.enum';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Conquistas (Gamificação)') 
@ApiBearerAuth()
@Controller('conquistas')
export class ConquistaController {
  constructor(private readonly conquistaService: ConquistaService) {}

  // --- 1. ENDPOINTS DE ESCRITA (CATÁLOGO - APENAS ADMIN) ---
  
  // 1. POST /conquistas (Criar nova regra de conquista)
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles(TipoUsuario.ADMIN) // CRÍTICO: Restrito apenas a Administradores
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova conquista no catálogo (Apenas Admin).' })
  @ApiResponse({ status: 201, description: 'Conquista criada.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async create(@Body() createConquistaDto: CreateConquistaDto, @Req() req: any) {
    const usuarioId = req.user.id;
    return this.conquistaService.create(createConquistaDto, usuarioId);
  }
  
  // 2. PUT /conquistas/:id (Atualizar completamente a regra)
  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles(TipoUsuario.ADMIN)
  @ApiOperation({ summary: 'Atualiza completamente uma regra de conquista (Apenas Admin).' })
  async update(@Param('id') id: string, @Body() updateConquistaDto: UpdateConquistaDto, @Req() req: any) {
    const usuarioId = req.user.id;
    // O service precisa ser refatorado para ter o método update com checagem de permissão
    return this.conquistaService.update(id, updateConquistaDto, usuarioId); 
  }

  // 3. DELETE /conquistas/:id (Excluir regra de conquista)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles(TipoUsuario.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove uma conquista do catálogo (Apenas Admin).' })
  async remove(@Param('id') id: string, @Req() req: any): Promise<void> {
    const usuarioId = req.user.id;
    return this.conquistaService.remove(id, usuarioId);
  }

  // --- 2. ENDPOINTS DE LEITURA (PÚBLICO) ---

  // 4. GET /conquistas (Listar catálogo - FILTROS e PAGINAÇÃO)
  @Get()
  @UseGuards(AuthGuard('jwt')) // Acessível a todos autenticados
  @ApiOperation({ summary: 'Lista o catálogo completo de conquistas disponíveis (com filtros).' })
  async findAll(@Query() query: FindAllConquistasDto): Promise<any> {
    return this.conquistaService.findAll(query);
  }

  // 5. GET /conquistas/:id (Visualizar detalhe da regra)
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Visualiza a regra detalhada de uma conquista.' })
  async findOne(@Param('id') id: string) {
    return this.conquistaService.findOne(id);
  }
}