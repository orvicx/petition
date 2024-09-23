import { Injectable, NotFoundException } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { CreateSituationDto } from '../dto/create-situation.dto';
import { Situation } from '../entities/situation.entity';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';

@Injectable()
export class TodoService {
  private firestore: Firestore;

  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp();
    }

    this.firestore = admin.firestore();
  }

  async createSituation(
    createSituationDto: CreateSituationDto,
    userId: string,
  ): Promise<string> {
    const situationId = uuidv4();
    const situation: Situation = {
      id: situationId,
      userId,
      title: createSituationDto.title,
      description: createSituationDto.description,
      createdAt: new Date(),
    };

    await this.firestore
      .collection('situations')
      .doc(situationId)
      .set(situation);

    return situationId;
  }

  async getSituation(situationId: string): Promise<Situation> {
    const doc = await this.firestore
      .collection('situations')
      .doc(situationId)
      .get();

    if (!doc.exists) {
      throw new NotFoundException('Situation not found');
    }

    return doc.data() as Situation;
  }
}
