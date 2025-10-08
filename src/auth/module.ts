import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './service';
import { AuthController } from './controller';
import { UsuarioModule } from '../usuario/module'; // <-- Importe o módulo do usuário
import { JwtStrategy } from './jwt.strategy'; // <-- Importe a estratégia


@Module({
  imports: [
    UsuarioModule, 
    forwardRef(() => UsuarioModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { 
          expiresIn: configService.get('JWT_EXPIRATION_TIME') || '3600s',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  // CRÍTICO: O NestJS encontra a estratégia nesta lista
  providers: [AuthService, JwtStrategy], // <-- DEVE INCLUIR JwtStrategy
  exports: [AuthService, JwtModule, JwtStrategy],
})
export class AuthModule {}