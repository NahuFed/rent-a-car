import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {UserService} from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(private readonly userService: UserService) {
    const cognitoAuthority = (process.env.AWS_COGNITO_AUTHORITY || '').replace(/\/$/, '');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      //audience: process.env.AWS_COGNITO_COGNITO_CLIENT_ID,
      issuer: process.env.AWS_COGNITO_AUTHORITY,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.AWS_COGNITO_AUTHORITY + '/.well-known/jwks.json',
      }),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.getUserByEmail(payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    this.logger.debug(`JWT payload: ${JSON.stringify(payload)}`);
    console.log(user.role.name);
    return { idUser: payload.sub, email: payload.email, role: user.role.name };
  }

  handleRequest(err, user, info, context) {
    if (err || !user) {
      this.logger.error(`Authentication error: ${info?.message || err?.message}`);
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
