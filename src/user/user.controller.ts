// user.controller.ts
import { Controller, Post, Body, Get, Patch, Param, UseGuards, Req, Delete, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { ResponseFormat } from 'src/global/response.format';
import { Roles } from '../auth/roles.decorator';
import { RoleGuard } from '../auth/role.guard';
import { UpdateUserDto } from './dto/update.user.dto';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}
// 카카오 로그인
  @Post('auth/kakao/login')
  async handleKakaoLogin(@Body('code') code: string) {
   const token = await this.userService.handleKakaoLogin(code);
   return new ResponseFormat({ token: `Bearer ${token}` });
}

// 회원가입
  @Post('signup')
  async signUp(@Body() body: any) {
    const { email, password } = body;
    const newUser = await this.userService.signUp(email, password);
    return new ResponseFormat(newUser);
  }
// 로그인
  @Post('login')
  async signIn(@Body() body: any) {
    const { email, password } = body;
    const token = await this.userService.signIn(email, password);
    return new ResponseFormat({ token: `Bearer ${token}` });
  }
// 회원 정보 조회
@Get('users/me')
@Roles('user')
@UseGuards(AuthGuard,RoleGuard)
async getUserInfo(@Req() req) {
  const user = req.user; // 요청 객체에서 유저 정보 추출
  const userInfo = await this.userService.getUserInfo(user.email);
  return new ResponseFormat(userInfo);
}


// 회원 정보 수정
  @Patch('users/me')
  @Roles('user')
  @UseGuards(AuthGuard,RoleGuard)
  async putUserInfo(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const { nickname, tag } = updateUserDto;
    const user = await this.userService.updateUserInfo(req.user.email, {nickname, tag});
    return new ResponseFormat(user);
  }

//사용자 신고 카운트 증가
  @Patch('users/complaint/:reviewId')
  @Roles('user')
  @UseGuards(AuthGuard,RoleGuard)
  async patchUserComplaint(req: Request, @Param('reviewId') reviewId: string) {
    const patchedUserComplaint = await this.userService.incrementComplaintByReviewId(reviewId);
    return new ResponseFormat(patchedUserComplaint);
  }

  // 회원 탈퇴
  @Patch('/users/me/withdrawal')
  @Roles('user')
  @UseGuards(AuthGuard,RoleGuard)
  async patchUserInfo(@Req() req) {
      const email = req.user.email;
      const user = await this.userService.patchUserInfo(email);
      return new ResponseFormat(user);
    } 

// 관리자 모든 회원 정보 조회
  @Get('/admin/users')
  @Roles('admin')
  @UseGuards(AuthGuard,RoleGuard)
  async getUsers(@Req() req) {
      const users = await this.userService.getUsers();
      return new ResponseFormat(users);
  }
//관리자 회원 삭제
  @Delete('/admin/users/:userId')
  @Roles('admin')
  @UseGuards(AuthGuard,RoleGuard)
  async deleteUser(@Param('userId') userId: string) {
      const user = await this.userService.deleteUser(userId);
      return new ResponseFormat(user);
    }
  
  //로그아웃
  @Get('logout')
  @Roles('user')
  @UseGuards(AuthGuard,RoleGuard)
  async logout(@Req() req, @Res() res) {
    try {
      // 토큰 유효성 확인 후 클라이언트에게 응답
      res.status(200).json({ message: '토큰이 유효합니다. 로그아웃 되었습니다.' });
      req.token = null;
      if (req.user.authMethod === 'kakao') {
        // 카카오 회원 로그아웃 처리
        const kakaoAccessToken = req.user.kakaoAccessToken; // 백엔드에서 받은 카카오 액세스 토큰
        await this.userService.kakaoLogout(kakaoAccessToken);
      }
    } catch (error) {
      // 토큰이 유효하지 않은 경우
      console.error('토큰 검증 오류:', error);
      res.status(403).json({ error: '토큰이 유효하지 않습니다.' });
    }
  }
}
