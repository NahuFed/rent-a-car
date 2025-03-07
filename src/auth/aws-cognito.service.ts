import { Injectable, forwardRef, Inject } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import {
  AuthFlowType,
  CognitoIdentityProvider,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { AuthRegisterUserDto } from './dto/auth-register-user.dto';
import { AuthChangePasswordUserDto } from './dto/auth-change-password-user.dto';
import { AuthForgotPasswordUserDto } from './dto/auth-forgot-password-user.dto';
import { AuthConfirmPasswordUserDto } from './dto/auth-confirm-password-user.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as crypto from 'crypto';
@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;
  private cognitoISP: CognitoIdentityProvider;

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectQueue('email-queue')
    private emailQueue: Queue,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID || '',
      ClientId: process.env.AWS_COGNITO_CLIENT_ID || '',
      endpoint: process.env.AWS_COGNITO_ENDPOINT || '',
    });
    this.cognitoISP = new CognitoIdentityProvider({
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.AWS_COGNITO_ENDPOINT || '',
    });

    console.log('Cognito ISP Config:', {
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.AWS_COGNITO_ENDPOINT || '',
    });
  }

  async registerUser(authRegisterUserDto: AuthRegisterUserDto) {
    const { email, password, firstName, lastName, dob, address, country, role } = authRegisterUserDto;

    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({
            Name: 'email',
            Value: email,
          }),
          new CognitoUserAttribute({
            Name: 'name',
            Value: firstName + ' ' + lastName,
          }),
          new CognitoUserAttribute({
            Name: 'custom:role',
            Value: role.name,
          }),
        ],
        [],
        async (err, result) => {
          if (err) {
            reject(err);
          } else {
            try {
              await this.cognitoISP.adminConfirmSignUp({
                UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID || '',
                Username: email,
              });
              const createUserDto: CreateUserDto = {
                firstName: firstName,
                lastName: lastName,
                dob: new Date(dob),
                email,
                address,
                country,
                role,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              await this.userService.create(createUserDto);
              await this.emailQueue.add('sendEmail', {
                to: email,
                subject: 'Welcome to Car Rental!',
                text: `Hello ${firstName}, your account has been successfully created! 🚗`,
              });
              resolve(result?.user);
            } catch (confirmErr) {
              reject(confirmErr);
            }
          }
        },
      );
    });
  }

  async authenticateUser(authLoginUserDto: AuthLoginUserDto) {
    const { email, password } = authLoginUserDto;
    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: process.env.AWS_COGNITO_CLIENT_ID || '',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    try {
      const result = await this.cognitoISP.send(command);
      const user = await this.userService.getUserByEmail(authLoginUserDto.email);
      return {
        accessToken: result.AuthenticationResult?.AccessToken,
        refreshToken: result.AuthenticationResult?.RefreshToken,
        idToken: result.AuthenticationResult?.IdToken,
        role: user?.role.name,
      };
    } catch (err) {
      throw new Error('Invalid credentials');
    }
  }

  async changeUserPassword(
    authChangePasswordUserDto: AuthChangePasswordUserDto,
  ) {
    const { email, currentPassword, newPassword } = authChangePasswordUserDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: currentPassword,
    });

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: () => {
          userCognito.changePassword(
            currentPassword,
            newPassword,
            (err, result) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(result);
            },
          );
        },
        onFailure: (err) => {
          reject(new Error('Current password is incorrect'));
        },
      });
    });
  }

  private generateVerificationCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  async forgotUserPassword(authForgotPasswordUserDto: AuthForgotPasswordUserDto) {
    const { email } = authForgotPasswordUserDto;


    const confirmationCode = this.generateVerificationCode();
    console.log(`✅ Forgot Password Code for ${email}: ${confirmationCode}`);

    await this.userService.storeVerificationCode(email, confirmationCode);

 
    await this.emailQueue.add('sendEmail', {
      to: email,
      subject: 'Reset Your Password',
      text: `Use this code to reset your password: ${confirmationCode}`,
    });

    return { message: 'Verification code sent to email' };
  }
  

  async confirmUserPassword(
    authConfirmPasswordUserDto: AuthConfirmPasswordUserDto,
  ) {
    const { email, confirmationCode, newPassword } = authConfirmPasswordUserDto;


    const isValidCode = await this.userService.verifyCode(email, confirmationCode);
    if (!isValidCode) {
      throw new Error('Invalid or expired confirmation code');
    }

    
    const params = {
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID || '', 
      ClientId: process.env.AWS_COGNITO_CLIENT_ID || '',
      Username: email,
      Password: newPassword,
      Permanent: true,
    };

    try {
      await this.cognitoISP.adminSetUserPassword(params);
      return { message: 'Password changed successfully' };
    } catch (error) {
      console.error(`❌ Error changing password for ${email}:`, error);
      throw new Error('Failed to change password');
    }
  }

  async listUsers() {
    const params = {
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID || '',
    };

    return new Promise((resolve, reject) => {
      this.cognitoISP.listUsers(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Users);
        }
      });
    });
  }
}
