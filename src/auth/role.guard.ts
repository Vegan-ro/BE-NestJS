import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // 여기서 Reflector를 가져옴
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractJwtToken(request);

    if (!token) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }
    try {
      const decoded = this.jwtService.verify(token);
      const isAdmin = decoded.isAdmin;
      
      const hasRole = requiredRoles.some((role) => 
        (isAdmin && role === 'admin') || (!isAdmin && role === 'user'));

      if (!hasRole) {
        throw new UnauthorizedException('이 작업을 수행할 권한이 없습니다.');
      }
      
      return hasRole;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('토큰 인증에 실패했습니다.');
    }
  }

  private extractJwtToken(request): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return null;
  }
}
