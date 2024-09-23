import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as admin from 'firebase-admin';
import { GeneratePdfDto } from '../dto/generate-pdf.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';

@Injectable()
export class PdfService {
  private storage: admin.storage.Storage;

  constructor() {
    this.storage = admin.storage();
  }

  async generatePdf(generatePdfDto: GeneratePdfDto): Promise<string> {
    const { content, signatureUrl, idCardUrl } = generatePdfDto;

    const doc = new PDFDocument();
    const tempFilePath = path.join('/tmp', `${uuidv4()}.pdf`);
    const writeStream = fs.createWriteStream(tempFilePath);
    doc.pipe(writeStream);

    doc.fontSize(12).text(content, {
      align: 'left',
    });

    if (signatureUrl) {
      const signatureImage = await this.fetchImage(signatureUrl);
      doc.addPage().image(signatureImage, {
        fit: [500, 500],
        align: 'center',
        valign: 'center',
      });
    }

    if (idCardUrl) {
      const idCardImage = await this.fetchImage(idCardUrl);
      doc.addPage().image(idCardImage, {
        fit: [500, 500],
        align: 'center',
        valign: 'center',
      });
    }

    doc.end();

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    const bucket = this.storage.bucket();
    const destination = `pdfs/${uuidv4()}.pdf`;
    await bucket.upload(tempFilePath, {
      destination,
      metadata: {
        contentType: 'application/pdf',
      },
    });

    fs.unlinkSync(tempFilePath);

    const file = bucket.file(destination);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });

    return url;
  }

  private async fetchImage(url: string): Promise<Buffer> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    return await response.buffer();
  }
}
