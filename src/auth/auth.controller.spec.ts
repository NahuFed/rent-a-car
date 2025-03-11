import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AwsCognitoService } from './aws-cognito.service';
import { AuthRegisterUserDto } from './dto/auth-register-user.dto';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { AuthChangePasswordUserDto } from './dto/auth-change-password-user.dto';
import { AuthForgotPasswordUserDto } from './dto/auth-forgot-password-user.dto';
import { AuthConfirmPasswordUserDto } from './dto/auth-confirm-password-user.dto';
import { Role, RoleType } from 'src/role/entities/role.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let awsCognitoService: Partial<AwsCognitoService>;

  beforeEach(async () => {
    awsCognitoService = {
      registerUser: jest.fn(),
      authenticateUser: jest.fn(),
      changeUserPassword: jest.fn(),
      forgotUserPassword: jest.fn(),
      confirmUserPassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AwsCognitoService, useValue: awsCognitoService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call awsCognitoService.registerUser with authRegisterUserDto and return its value', async () => {
      const authRegisterUserDto: AuthRegisterUserDto = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        dob: '1990-01-01',
        address: '123 Test St',
        country: 'Testland',          // propiedad agregada
        role: { name: RoleType.USER } as Role,       // propiedad agregada
        password: 'Password123',      // propiedad agregada
      };
      const expectedResult = { message: 'User registered successfully' };
      (awsCognitoService.registerUser as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.register(authRegisterUserDto);
      expect(awsCognitoService.registerUser).toHaveBeenCalledWith(authRegisterUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should call awsCognitoService.authenticateUser with authLoginUserDto and return its value', async () => {
      const authLoginUserDto: AuthLoginUserDto = {
        email: 'test@example.com',
        password: 'Password123',
      };
      const expectedResult = { token: 'jwt-token' };
      (awsCognitoService.authenticateUser as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.login(authLoginUserDto);
      expect(awsCognitoService.authenticateUser).toHaveBeenCalledWith(authLoginUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('changePassword', () => {
    it('should call awsCognitoService.changeUserPassword with authChangePasswordUserDto', async () => {
      const authChangePasswordUserDto: AuthChangePasswordUserDto = {
        email: 'test@example.com',
        currentPassword: 'OldPassword123', // propiedad agregada
        newPassword: 'NewPassword123',
      };
      (awsCognitoService.changeUserPassword as jest.Mock).mockResolvedValue(undefined);

      const result = await controller.changePassword(authChangePasswordUserDto);
      expect(awsCognitoService.changeUserPassword).toHaveBeenCalledWith(authChangePasswordUserDto);
      expect(result).toBeUndefined();
    });
  });

  describe('forgotPassword', () => {
    it('should call awsCognitoService.forgotUserPassword with authForgotPasswordUserDto and return its value', async () => {
      const authForgotPasswordUserDto: AuthForgotPasswordUserDto = {
        email: 'test@example.com',
      };
      const expectedResult = { message: 'Forgot password email sent' };
      (awsCognitoService.forgotUserPassword as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.forgotPassword(authForgotPasswordUserDto);
      expect(awsCognitoService.forgotUserPassword).toHaveBeenCalledWith(authForgotPasswordUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('confirmPassword', () => {
    it('should call awsCognitoService.confirmUserPassword with authConfirmPasswordUserDto and return its value', async () => {
      const authConfirmPasswordUserDto: AuthConfirmPasswordUserDto = {
        email: 'test@example.com',
        confirmationCode: '123456',
        newPassword: 'NewPassword123',
      };
      const expectedResult = { message: 'Password has been changed' };
      (awsCognitoService.confirmUserPassword as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.confirmPassword(authConfirmPasswordUserDto);
      expect(awsCognitoService.confirmUserPassword).toHaveBeenCalledWith(authConfirmPasswordUserDto);
      expect(result).toEqual(expectedResult);
    });
  });
});
