import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PdfService } from '../services/pdf.service';
import { GeneratePdfDto } from '../dto/generate-pdf.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @UseGuards(JwtAuthGuard)
  @Post('generate')
  async generatePdf(
    @Body() generatePdfDto: GeneratePdfDto,
  ): Promise<{ pdfUrl: string }> {
    const pdfUrl = await this.pdfService.generatePdf(generatePdfDto);
    return { pdfUrl };
  }
}
