import { Injectable, NotFoundException } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import * as admin from 'firebase-admin';
import { Petition } from '../entities/petition.entity';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { CreatePetitionDto } from '../dto/create-petition.dto';

@Injectable()
export class UserService {
  private firestore: Firestore;
  private storage: admin.storage.Storage;

  constructor() {
    this.firestore = admin.firestore();
    this.storage = admin.storage();
  }

  async createPetition(
    petitionData: CreatePetitionDto & { userId: string },
  ): Promise<string> {
    const petitionId = uuidv4();
    const createdAt = new Date();
    const updatedAt = createdAt;
    const petitionerName = 'Generated Name';

    const fullPetitionData: Petition = {
      ...petitionData,
      id: petitionId,
      petitionerName,
      createdAt,
      updatedAt,
    };

    await this.firestore
      .collection('petitions')
      .doc(petitionId)
      .set(fullPetitionData);

    return petitionId;
  }

  async getPetition(petitionId: string): Promise<Petition> {
    const doc = await this.firestore
      .collection('petitions')
      .doc(petitionId)
      .get();

    if (!doc.exists) {
      throw new NotFoundException('Petition not found');
    }

    return doc.data() as Petition;
  }

  async updatePetition(
    petitionId: string,
    updateData: Partial<Petition>,
  ): Promise<void> {
    const petitionRef = this.firestore.collection('petitions').doc(petitionId);

    const doc = await petitionRef.get();
    if (!doc.exists) {
      throw new NotFoundException('Petition not found');
    }

    await petitionRef.update(updateData);
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const bucket = this.storage.bucket();
    const destination = `${folder}/${uuidv4()}_${file.originalname}`;
    await bucket.upload(file.path, {
      destination,
      metadata: {
        contentType: file.mimetype,
      },
    });

    fs.unlinkSync(file.path);

    const fileRef = bucket.file(destination);
    const [url] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });

    return url;
  }
}
