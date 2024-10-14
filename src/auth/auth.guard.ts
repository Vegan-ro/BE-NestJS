import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { RoleGuard } from './role.guard'; // 롤 가드 추가

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private roleGuard: RoleGuard, // 롤 가드 주입
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // 1. Bearer 토큰 및 Basic 토큰 모두 확인
    const token = this.extractJwtToken(request);
    if (!token) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }
    
    // 2. 롤과 인증 동시에 확인
    this.roleGuard.canActivate(context); // 롤 가드 실행

    try {
      // 3. 토큰 검증
      const decoded = this.jwtService.verify(token);
      
      // 4. 만료 시간 확인
      const now = Date.now() / 1000; // 현재 시간 (초)
      if (decoded.exp <= now) {
        throw new UnauthorizedException('토큰이 만료되었습니다.');
      }

      request.user = decoded; // 사용자 정보 요청에 추가
      return true; // 인증 성공
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('토큰 인증에 실패했습니다.');
    }
  }

  private extractJwtToken(request): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader && (authHeader.startsWith('Bearer ') || authHeader.startsWith('Basic '))) {
      return authHeader.split(' ')[1];
    }
    return null;
  }
}
