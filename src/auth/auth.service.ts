import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    if (!admin.apps.length) {
      const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');
      const clientEmail = this.configService.get<string>(
        'FIREBASE_CLIENT_EMAIL',
      );
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');

      console.log('Firebase Config:', {
        projectId,
        privateKey: privateKey ? 'Exists' : 'Missing',
        clientEmail: clientEmail ? 'Exists' : 'Missing',
      });

      if (!privateKey || !clientEmail || !projectId) {
        console.error(
          'Firebase credentials are missing in environment variables.',
        );
        throw new Error(
          'Firebase credentials are missing in environment variables.',
        );
      }

      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            privateKey: privateKey.replace(/\\n/g, '\n'),
            clientEmail,
          }),
          projectId,
          storageBucket: `${projectId}.appspot.com`,
        });

        console.log('Firebase Admin SDK initialized successfully.');
      } catch (error) {
        console.error('Firebase Admin SDK initialization error:', error);
        throw error;
      }
    }
  }

  async createCustomToken(phoneNumber: string): Promise<string> {
    const uid = `user_${phoneNumber}`;
    try {
      await admin.auth().getUser(uid);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        await admin.auth().createUser({
          uid,
          phoneNumber,
        });
      } else {
        throw error;
      }
    }

    return await admin.auth().createCustomToken(uid);
  }

  async validateFirebaseIdToken(idToken: string): Promise<string> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const payload = {
        uid: decodedToken.uid,
        phoneNumber: decodedToken.phone_number,
      };
      return this.jwtService.sign(payload);
    } catch (error) {
      console.error('Error verifying ID token:', error);
      throw new UnauthorizedException('Invalid ID token');
    }
  }
}
