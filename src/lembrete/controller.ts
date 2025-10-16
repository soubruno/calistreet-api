import { Controller, Post, Get, Put, Patch, Delete, Body, HttpCode, HttpStatus, Param, UseGuards, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LembreteService } from './service';
import { CreateLembreteDto } from './dto/create-lembrete.dto';
import { UpdateLembreteDto } from './dto/update-lembrete.dto';
import { FindAllLembretesDto } from './dto/find-all-lembretes.dto';
import { Lembrete } from './entity';


@ApiTags('Lembretes & Notificações') 
@ApiBearerAuth()
@Controller('lembretes')
@UseGuards(AuthGuard('jwt')) // Todas as rotas são protegidas (apenas o dono pode ver/editar)
export class LembreteController {
  constructor(private readonly lembreteService: LembreteService) {}
  
  // 1. POST /lembretes (Criar Lembrete)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um novo lembrete de treino ou hidratação.' })
  async create(@Body() dto: CreateLembreteDto, @Req() req: any) {
    const usuarioId = req.user.id;
    return this.lembreteService.create(dto, usuarioId);
  }

  // 2. GET /lembretes (Listar lembretes - Filtros por Dia/Hora)
  @Get()
  @ApiOperation({ summary: 'Lista os lembretes do usuário logado com filtros.' })
  @ApiQuery({ name: 'diaSemana', required: false })
  @ApiQuery({ name: 'hora', required: false })
  async findAll(@Query() query: FindAllLembretesDto, @Req() req: any): Promise<any> {
    const usuarioId = req.user.id;
    return this.lembreteService.findAll(usuarioId, query);
  }

  // 3. GET /lembretes/:id (Detalhes/Visualizar)
  @Get(':id')
  @ApiOperation({ summary: 'Visualiza os detalhes de um lembrete específico.' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    const usuarioId = req.user.id;
    return this.lembreteService.findOne(id, usuarioId);
  }
  
  // 4. PUT /lembretes/:id (Atualização completa)
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza completamente um lembrete (Dia, Hora, Título).' })
  async update(@Param('id') id: string, @Body() dto: UpdateLembreteDto, @Req() req: any): Promise<Lembrete> {
      const usuarioId = req.user.id;
      return this.lembreteService.update(id, usuarioId, dto);
  }
  
  // 5. PATCH /lembretes/:id (Atualização parcial - Ex: Ativar/Desativar)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza parcialmente o lembrete (Ex: desativa ou ativa).' })
  async updatePartial(@Param('id') id: string, @Body() dto: UpdateLembreteDto, @Req() req: any): Promise<Lembrete> {
      const usuarioId = req.user.id;
      return this.lembreteService.update(id, usuarioId, dto);
  }

  // 6. DELETE /lembretes/:id (Remover/Cancelar)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove um lembrete e cancela o agendamento (Filas).' })
  async remove(@Param('id') id: string, @Req() req: any): Promise<void> {
    const usuarioId = req.user.id;
    await this.lembreteService.remove(id, usuarioId); 
  }
}