import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AwsCognitoService } from './aws-cognito.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { RolesGuard } from './roles.guard';
import { forwardRef } from '@nestjs/common';
@Module({
  imports: [forwardRef(() => UserModule), PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthController],
  providers: [AwsCognitoService, JwtStrategy, RolesGuard] ,  
})
export class AuthModule {}
