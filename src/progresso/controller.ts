import { Controller, Post, Get, Put, Delete, Body, HttpCode, HttpStatus, Param, UseGuards, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProgressoService } from './service';
import { CreateProgressoDto } from './dto/create-progresso.dto';
import { FindAllProgressoDto } from './dto/find-all-progresso.dto';
import { UpdateProgressoDto } from './dto/update-progresso.dto'; // Adicionado para PUT
import { CreateMedidaDto } from './dto/create-medida.dto'; 
import { MedidaFisica } from './medida-fisica.entity'; // Usado para tipagem de retorno


@ApiTags('Progresso & Histórico') 
@ApiBearerAuth()
@Controller('progresso')
@UseGuards(AuthGuard('jwt')) // Todas as rotas de progresso são protegidas por autenticação
export class ProgressoController {
  constructor(private readonly progressoService: ProgressoService) {}
  
  // --- ENDPOINTS DE Progresso MANUAL (MEDIDAS FÍSICAS) ---

  // 6. POST /progresso/medidas (Salvar progresso manual)
  @Post('medidas')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registra uma medida física (peso, circunferência) manualmente.' })
  async createMedida(@Body() dto: CreateMedidaDto, @Req() req: any): Promise<MedidaFisica> {
    const usuarioId = req.user.id;
    return this.progressoService.createMedida(dto, usuarioId);
  }

  // 7. GET /progresso/medidas (Listar todas as medidas do usuário)
  @Get('medidas')
  @ApiOperation({ summary: 'Lista o histórico de medidas físicas do usuário logado.' })
  async findAllMedidas(@Req() req: any): Promise<MedidaFisica[]> {
    const usuarioId = req.user.id;
    return this.progressoService.findAllMedidas(usuarioId);
  }
  
  // 8. DELETE /progresso/medidas/:id (Remover uma medida física)
  @Delete('medidas/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove um registro de medida física (Apenas o dono).' })
  async removeMedida(@Param('id') medidaId: string, @Req() req: any): Promise<void> {
    const usuarioId = req.user.id;
    return this.progressoService.removeMedida(medidaId, usuarioId); 
  }

  
  // --- C. ENDPOINTS DE ESTATÍSTICAS E FLUXO ---
  
  // 9. GET /progresso/estatisticas (Estatísticas e Gráficos)
  @Get('estatisticas')
  @ApiOperation({ summary: 'Retorna estatísticas de performance (volume, tempo, últimas medidas).' })
  async getEstatisticas(@Req() req: any) {
    const usuarioId = req.user.id;
    return this.progressoService.getEstatisticas(usuarioId);
  }

  // 10. GET /progresso/comparar (Comparar progresso)
  @Get('comparar')
  @ApiOperation({ summary: 'Compara dados de progresso (ex: peso atual vs. 3 meses atrás).' })
  async compararProgresso(@Req() req: any) {
    const usuarioId = req.user.id;
    return this.progressoService.compararProgresso(usuarioId);
  }

  // 11. POST /progresso/:id/compartilhar (Gerar link de compartilhamento - FILAS BÔNUS)
  @Post(':id/compartilhar')
  @ApiOperation({ summary: 'Gera uma imagem de conquista para compartilhamento (FILAS - Bônus).' })
  async gerarCompartilhamento(@Param('id') sessaoId: string, @Req() req: any) {
    // A lógica de filas será inserida no service.
    return { message: `Processamento de imagem para sessão ${sessaoId} iniciado.` };
  }
  
  // 12. GET /progresso/conquistas (Listar as conquistas obtidas)
  @Get('conquistas')
  @ApiOperation({ summary: 'Lista todas as conquistas obtidas pelo usuário logado.' })
  async getConquistas(@Req() req: any) {
    const usuarioId = req.user.id;
    return this.progressoService.getConquistas(usuarioId);
  }

  
  // --- GESTÃO DO HISTÓRICO DE SESSÕES (Progresso) ---

  // 1. POST /progresso (Registro de sessão concluída - Criação Transacional)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registra uma sessão de treino concluída (Histórico).' })
  async createSessao(@Body() dto: CreateProgressoDto, @Req() req: any) {
    const usuarioId = req.user.id;
    return this.progressoService.createSessao(dto, usuarioId);
  }

  // 2. GET /progresso (Listar histórico de sessões - Filtros e Paginação)
  @Get()
  @ApiOperation({ summary: 'Lista o histórico de sessões do usuário logado.' })
  async findAllSessoes(@Query() query: FindAllProgressoDto, @Req() req: any): Promise<any> {
    const usuarioId = req.user.id;
    return this.progressoService.findAllSessoes(usuarioId, query);
  }

  // 3. GET /progresso/:id (Detalhes de uma sessão de progresso)
  @Get(':id')
  @ApiOperation({ summary: 'Visualiza os detalhes de uma sessão de treino (inclui resultados de exercícios).' })
  async findOneSessao(@Param('id') sessaoId: string, @Req() req: any) {
    const usuarioId = req.user.id;
    return this.progressoService.findOneSessao(sessaoId, usuarioId);
  }
  
  // 4. PUT /progresso/:id (Atualizar o cabeçalho da sessão)
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza o registro de sessão de treino (apenas o cabeçalho, ex: status, notas).' })
  async updateSessao(@Param('id') sessaoId: string, @Body() dto: UpdateProgressoDto, @Req() req: any): Promise<any> {
      const usuarioId = req.user.id;
      // Permissão: Dono ou Admin
      return this.progressoService.updateSessao(sessaoId, dto, usuarioId);
  }
  
  // 5. DELETE /progresso/:id (Remover uma sessão de progresso)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove uma sessão de histórico/progresso (Apenas o dono).' })
  async removeSessao(@Param('id') sessaoId: string, @Req() req: any): Promise<void> {
    const usuarioId = req.user.id;
    return this.progressoService.removeSessao(sessaoId, usuarioId); 
  }
  
  
  
}