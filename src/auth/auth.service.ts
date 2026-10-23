import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from '../common/hashing/hashing.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login-dto';
import type { JwtPayload } from './types/jwt-payload-type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async makeLogin(loginDto: LoginDto) {
    // Email  -> Repositorio | UserService
    const user = await this.userService.findByEmail(loginDto.email);
    const error = new UnauthorizedException('Usuário ou senha inválido');

    if (!user) {
      throw error;
    }

    // Comparar senha com hash -> HashingService <- CommonModule
    const isPasswordValid = await this.hashingService.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw error;
    }
    // JwtService <- JwtModule

    const JwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const acessToken = await this.jwtService.signAsync(JwtPayload);

    user.forceLogout = false;
    await this.userService.save(user);

    return { acessToken };
  }
}
