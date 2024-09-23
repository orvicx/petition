export class Petition {
  id: string; // 탄원서 ID
  situationId: string;
  petitionerName: string;
  content: string;
  signatureUrl?: string; // 전자서명 이미지 URL
  idCardUrl?: string; // 신분증 이미지 URL
  createdAt: Date;
  updatedAt: Date;
}
