import { Controller, Get, Param, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RelatoriosService } from './service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { TipoUsuario } from '../usuario/entity';

@ApiTags('Relatórios & Estatísticas Finais') 
@ApiBearerAuth()
@Controller('relatorios')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  // 1. GET /relatorios/geral (Visão Global)
  @Get('geral')
  @Roles(TipoUsuario.ADMIN) // Apenas administradores veem a visão geral
  @UseInterceptors(CacheInterceptor) // Cache Ativado
  @ApiOperation({ summary: 'Retorna estatísticas globais da plataforma (Admin only).' })
  async getGeral(): Promise<any> {
    return this.relatoriosService.getGeral();
  }
  
  // 2. GET /relatorios/atividades (Relatório de Volume de Treino)
  @Get('atividades')
  @UseInterceptors(CacheInterceptor) // Cache Ativado
  @ApiOperation({ summary: 'Retorna o volume total de atividades e top exercícios do usuário logado.' })
  async getRelatorioAtividades(@Req() req: any): Promise<any> {
    const usuarioId = req.user.id;
    return this.relatoriosService.getRelatorioAtividades(usuarioId);
  }

  // 3. GET /relatorios/nutricao (Relatório de Progresso Físico)
  @Get('nutricao')
  @ApiOperation({ summary: 'Retorna o histórico de peso e medidas (para fins nutricionais).' })
  async getRelatorioNutricao(@Req() req: any): Promise<any> {
    const usuarioId = req.user.id;
    return this.relatoriosService.getRelatorioNutricao(usuarioId);
  }
  
  // 4. GET /relatorios/usuario/:id (Relatório Completo de um Usuário)
  @Get('usuario/:id')
  @Roles(TipoUsuario.ADMIN, TipoUsuario.PROFISSIONAL) // Apenas admins ou profissionais podem ver
  @UseInterceptors(CacheInterceptor) // Cache Ativado
  @ApiOperation({ summary: 'Relatório completo de histórico e performance de um usuário específico.' })
  async getRelatorioUsuario(@Param('id') usuarioId: string): Promise<any> {
    return this.relatoriosService.getRelatorioUsuario(usuarioId);
  }

  // --- Rotas de Relatórios Remanescentes ---
  
  // 5. GET /relatorios/tendencias (Análise de Tendência de Longo Prazo)
  @Get('tendencias')
  @UseInterceptors(CacheInterceptor) // Cache Ativado
  @ApiOperation({ summary: 'Análise de tendências de performance ao longo de 6 meses.' })
  async getTendencias(@Req() req: any): Promise<any> {
      const usuarioId = req.user.id;
      return { message: "Tendências de performance para 6 meses" };
  }
  
  // 6. GET /relatorios/metas (Status de Metas)
  @Get('metas')
  @ApiOperation({ summary: 'Relatório de status de todas as metas ativas do usuário.' })
  async getRelatorioMetas(@Req() req: any): Promise<any> {
      return { message: "Relatório de Metas Ativas" };
  }
  
  // 7. GET /relatorios/desafios (Performance em Desafios)
  @Get('desafios')
  @ApiOperation({ summary: 'Relatório de performance em desafios (Ex: L-Sit vs. Tempo).' })
  async getRelatorioDesafios(@Req() req: any): Promise<any> {
      return { message: "Relatório de Desafios Concluídos" };
  }
  
  // 8. GET /relatorios/erros (Relatório de Erros - Admin)
  @Get('erros')
  @Roles(TipoUsuario.ADMIN)
  @ApiOperation({ summary: 'Relatório de erros/logs (Admin).' })
  async getRelatorioErros(): Promise<any> {
      return { message: "Relatório de Erros e Logs" };
  }

}