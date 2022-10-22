import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(id: number) {
    const payload = { id };

    return this.jwtService.sign(payload);
  }
}
