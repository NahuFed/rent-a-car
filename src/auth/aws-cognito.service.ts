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
@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;
  private cognitoISP: CognitoIdentityProvider;

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
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
      return {
        accessToken: result.AuthenticationResult?.AccessToken,
        refreshToken: result.AuthenticationResult?.RefreshToken,
        idToken: result.AuthenticationResult?.IdToken,
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
  async forgotUserPassword(
    authForgotPasswordUserDto: AuthForgotPasswordUserDto,
  ) {
    const { email } = authForgotPasswordUserDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.forgotPassword({
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  async confirmUserPassword(
    authConfirmPasswordUserDto: AuthConfirmPasswordUserDto,
  ) {
    const { email, confirmationCode, newPassword } = authConfirmPasswordUserDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.confirmPassword(confirmationCode, newPassword, {
        onSuccess: () => {
          resolve({ status: 'success' });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
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
