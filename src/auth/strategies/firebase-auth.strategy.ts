import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  constructor() {
    super();
  }

  async validate(req: Request): Promise<any> {
    const idToken = req.headers['authorization']?.split('Bearer ')[1];

    if (!idToken) {
      throw new UnauthorizedException('No ID token provided');
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error('Error verifying ID token:', error);
      throw new UnauthorizedException('Invalid ID token');
    }
  }
}
