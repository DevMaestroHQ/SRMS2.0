// Mock OCR service - in a real implementation, you would use actual OCR libraries
// For this demo, we'll simulate OCR extraction
export interface OCRResult {
  name: string;
  tuRegd: string;
  marks: string;
}

export class OCRService {
  static async extractDataFromPDF(pdfBuffer: Buffer, filename: string): Promise<OCRResult> {
    // Simulate OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock extraction based on filename for demo purposes
    // In a real implementation, you would use pdf2image + pytesseract or similar
    const mockData = this.generateMockData(filename);
    
    return mockData;
  }

  private static generateMockData(filename: string): OCRResult {
    // Generate realistic mock data for demonstration
    const names = [
      "John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "David Brown",
      "Lisa Davis", "Tom Miller", "Anna Garcia", "Chris Martinez", "Emma Taylor"
    ];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomRegNo = `7-2-123-${Math.floor(Math.random() * 900 + 100)}-2020`;
    const randomMarks = `${Math.floor(Math.random() * 30 + 70)}%`;
    
    return {
      name: randomName,
      tuRegd: randomRegNo,
      marks: randomMarks,
    };
  }
}
