import { Controller, Post, Get, Put, Delete, Body, HttpCode, HttpStatus, Param, UseGuards, Query, Req, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TreinoService } from './service';
import { CreateTreinoDto, TreinoItemDto } from './dto/create-treino.dto';
import { UpdateTreinoDto } from './dto/update-treino.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { TipoUsuario } from '../common/enums/tipo-usuario.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { FindAllTreinosDto } from './dto/find-all-treinos.dto';

@ApiTags('Treinos') 
@ApiBearerAuth()
@Controller('treinos')
export class TreinoController {
  constructor(private readonly treinoService: TreinoService) {}

  // --- 1. ENDPOINTS DE GERENCIAMENTO (ESCRITA/COMANDO) ---
  
  // 1. POST /treinos (Criar treino - PROTEGIDO)
  // Permite criar templates (Profissional/Admin) ou treinos customizados (Aluno - precisa de lógica extra no service)
  @Post()
  @UseGuards(AuthGuard('jwt')) 
  @ApiOperation({ summary: 'Cria um novo plano de treino.' })
  @ApiResponse({ status: 201, description: 'Treino criado com sucesso.' })
  async create(@Body() createTreinoDto: CreateTreinoDto, @Req() req: any) {
    const criadoPorId = req.user.id; // Puxa o ID do usuário logado
    return this.treinoService.create(createTreinoDto, criadoPorId);
  }
  
  // 2. PUT /treinos/:id (Editar treino - PROTEGIDO)
  // Apenas quem criou (e Admin) pode editar. Lógica no Service.
  @Put(':id')
  @UseGuards(AuthGuard('jwt')) 
  @ApiOperation({ summary: 'Atualiza completamente um plano de treino.' })
  async update(@Param('id') id: string, @Body() updateTreinoDto: UpdateTreinoDto, @Req() req: any) {
    const usuarioId = req.user.id;
    // O service deve checar permissão (usuário logado == criador ou ADMIN)
    return this.treinoService.update(id, updateTreinoDto, usuarioId); 
  }

  // 3. DELETE /treinos/:id (Excluir treino - PROTEGIDO)
  // Apenas quem criou (e Admin) pode excluir.
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Exclui um plano de treino.' })
  async remove(@Param('id') id: string, @Req() req: any): Promise<void> {
    const usuarioId = req.user.id;
    return this.treinoService.remove(id, usuarioId); 
  }

  // --- 2. ENDPOINTS DE LEITURA (QUERY) ---

  // 4. GET /treinos (Listar treinos - FILTROS e PAGINAÇÃO)
  // Requisito 2: Filtros. Filtros principais: usuarioId (se for treino customizado) e nivel.
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Lista treinos disponíveis com filtros e paginação.' })
  async findAll(
    @Query() query: FindAllTreinosDto
  ): Promise<any> {
    // Implementação da listagem completa no Service
    return this.treinoService.findAll(query); 
  }

  // 5. GET /treinos/:id (Visualizar treino - QUERY)
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Visualiza a estrutura detalhada de um treino (itens/prescrição).' })
  async findOne(@Param('id') id: string) {
    return this.treinoService.findOne(id);
  }

  // --- 3. ENDPOINTS DE GERENCIAMENTO DE ITENS E FLUXO (6 Endpoints Faltantes) ---

  // Os próximos 6 endpoints serão mapeados para o FLUXO de execução e gerenciamento (ex: iniciar/pausar).
  // Eles farão a ponte com o futuro módulo Progresso.

  // 6. POST /treinos/:id/iniciar (Iniciar treino)
  @Post(':id/iniciar')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Inicia uma sessão de treino e cria um registro em Progresso.' })
  async iniciarTreino(@Param('id') treinoId: string, @Req() req: any) {
    // Isso chamará o ProgressoService futuramente.
    return { message: `Iniciando treino ${treinoId} para o usuário ${req.user.id}` };
  }

  // 7. POST /treinos/:id/pausar (Pausar cronômetro)
  @Post(':id/pausar')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Registra o estado de pausa da sessão de treino.' })
  async pausarTreino(@Param('id') treinoId: string) {
    // Isso atualizará o ProgressoService futuramente.
    return { message: `Treino ${treinoId} pausado.` };
  }

  // 8. POST /treinos/:id/concluir (Concluir treino e salvar no histórico)
  @Post(':id/concluir')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Conclui a sessão de treino e salva os resultados finais em Progresso.' })
  async concluirTreino(@Param('id') treinoId: string) {
    // CRÍTICO: Disparará EVENTOS para Conquistas e Progresso (Bônus).
    return { message: `Treino ${treinoId} concluído e histórico salvo.` };
  }

  // 9. PATCH /treinos/:id/marcar-exercicio/:exercicioId (Marcar exercício como feito)
  @Patch(':id/marcar-exercicio/:exercicioId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Marca um exercício como concluído dentro da sessão atual.' })
  async marcarExercicioFeito(@Param('id') treinoId: string, @Param('exercicioId') exercicioId: string) {
    // Isso atualizará o ProgressoService futuramente.
    return { message: `Exercício ${exercicioId} marcado como feito no treino ${treinoId}.` };
  }
  
  // 10. POST /treinos/:id/exercicios (Adicionar exercício ao treino)
  @Post(':id/exercicios')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Adiciona um novo exercício à prescrição de um treino existente.' })
  // Mudar 'itemDto: any' para o tipo correto TreinoItemDto
  async adicionarExercicio(@Param('id') treinoId: string, @Body() itemDto: TreinoItemDto, @Req() req: any) { 
      const usuarioId = req.user.id;
      
      // <<< CHAMADA REAL AO SERVICE >>>
      return this.treinoService.adicionarExercicio(treinoId, itemDto, usuarioId);
  }

  // 11. DELETE /treinos/:id/exercicios/:exercicioId (Remover exercício do treino)
  @Delete(':id/exercicios/:exercicioId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove um exercício da prescrição de um treino.' })
  async removerExercicio(
    @Param('id') treinoId: string, 
    @Param('exercicioId') exercicioId: string,
    @Req() req: any 
  ): Promise<void> {
    const usuarioId = req.user.id;
    return this.treinoService.removeExercicio(treinoId, exercicioId, usuarioId); 
  }
  
  // 12. GET /treinos/:id/exercicios (Listar exercícios do treino)
  @Get(':id/exercicios')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Lista os exercícios (e sua prescrição) dentro de um treino.' })
  async listarItensTreino(@Param('id') treinoId: string) {
    // Isso deve retornar os itens com a prescrição (TreinoExercicio)
    return this.treinoService.findOne(treinoId);
  }
}