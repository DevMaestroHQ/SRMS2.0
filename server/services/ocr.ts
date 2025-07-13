import pdfParse from "pdf-parse";
import { createWorker } from "tesseract.js";
import pdf2pic from "pdf2pic";
import fs from "fs";
import path from "path";

export interface OCRResult {
  name: string;
  tuRegd: string;
  marks: string;
}

export class OCRService {
  static async extractDataFromPDF(pdfBuffer: Buffer, filename: string): Promise<OCRResult> {
    try {
      // First try to extract text directly from PDF
      let text = "";
      
      try {
        const pdfData = await pdfParse(pdfBuffer);
        text = pdfData.text;
        console.log("Extracted text from PDF:", text.substring(0, 200) + "...");
      } catch (pdfError) {
        console.log("Direct PDF text extraction failed, trying OCR...");
      }

      // If no text found or text is minimal, use OCR on PDF images
      if (!text || text.trim().length < 50) {
        text = await this.performOCROnPDF(pdfBuffer, filename);
      }

      // Extract student information using regex patterns
      const extractedData = this.extractStudentInfo(text);
      
      if (!extractedData.name || !extractedData.tuRegd) {
        // If extraction fails, provide a helpful error
        throw new Error("Could not extract student information from PDF. Please ensure the PDF contains clear, readable text with student name and T.U. registration number.");
      }

      return extractedData;
    } catch (error) {
      console.error("OCR extraction error:", error);
      throw new Error(`Failed to extract data from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async performOCROnPDF(pdfBuffer: Buffer, filename: string): Promise<string> {
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempPdfPath = path.join(tempDir, `temp_${Date.now()}_${filename}`);
    
    try {
      // Save PDF to temp file
      fs.writeFileSync(tempPdfPath, pdfBuffer);

      // Convert PDF to images
      const convert = pdf2pic.fromPath(tempPdfPath, {
        density: 300,
        saveFilename: "page",
        savePath: tempDir,
        format: "png",
        width: 2480,
        height: 3508
      });

      const results = await convert.bulk(-1);
      
      // Perform OCR on each page
      let allText = "";
      const worker = await createWorker();
      
      for (const result of results) {
        if (result.path) {
          const { data: { text } } = await worker.recognize(result.path);
          allText += text + "\n";
          
          // Clean up image file
          if (fs.existsSync(result.path)) {
            fs.unlinkSync(result.path);
          }
        }
      }
      
      await worker.terminate();
      return allText;
    } finally {
      // Clean up temp PDF file
      if (fs.existsSync(tempPdfPath)) {
        fs.unlinkSync(tempPdfPath);
      }
    }
  }

  private static extractStudentInfo(text: string): OCRResult {
    const normalizedText = text.replace(/\s+/g, ' ').trim();
    
    // Common patterns for student information extraction
    const patterns = {
      // Name patterns
      name: [
        /(?:name|student\s*name|full\s*name)\s*:?\s*([a-zA-Z\s.]+?)(?:\n|reg|roll|marks|grade|result)/i,
        /name\s*[-:]\s*([a-zA-Z\s.]+?)(?:\n|reg|roll|t\.u|marks)/i,
        /student\s*[-:]\s*([a-zA-Z\s.]+?)(?:\n|reg|roll|t\.u|marks)/i,
      ],
      
      // T.U. Registration patterns
      tuRegd: [
        /(?:t\.?u\.?\s*reg(?:d|istration)?\.?\s*no\.?|registration\s*no\.?|reg\.?\s*no\.?)\s*:?\s*([0-9\-\/]+)/i,
        /(?:t\.?u\.?\s*roll\s*no\.?|roll\s*no\.?)\s*:?\s*([0-9\-\/]+)/i,
        /(?:reg\.?\s*#|registration\s*#)\s*:?\s*([0-9\-\/]+)/i,
        /([0-9]{1,2}[-\/][0-9]{1,2}[-\/][0-9]{2,4}[-\/][0-9]{2,4}[-\/][0-9]{4})/,
      ],
      
      // Marks/Grade patterns
      marks: [
        /(?:total\s*marks?|marks?\s*obtained|final\s*marks?|percentage)\s*:?\s*([0-9]+(?:\.[0-9]+)?%?)/i,
        /(?:grade|result)\s*:?\s*([A-F][+-]?|[0-9]+(?:\.[0-9]+)?%?)/i,
        /([0-9]+(?:\.[0-9]+)?%)/,
        /(?:marks?)\s*:?\s*([0-9]+(?:\/[0-9]+)?)/i,
      ]
    };

    let name = "";
    let tuRegd = "";
    let marks = "";

    // Extract name
    for (const pattern of patterns.name) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        name = match[1].trim().replace(/\s+/g, ' ');
        // Clean up common OCR artifacts
        name = name.replace(/[^a-zA-Z\s.]/g, '').trim();
        if (name.length > 3 && name.length < 50) {
          break;
        }
      }
    }

    // Extract T.U. registration
    for (const pattern of patterns.tuRegd) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        tuRegd = match[1].trim();
        if (tuRegd.length > 5) {
          break;
        }
      }
    }

    // Extract marks
    for (const pattern of patterns.marks) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        marks = match[1].trim();
        break;
      }
    }

    // Fallback: if no marks found, look for any percentage or grade
    if (!marks) {
      const fallbackMarks = normalizedText.match(/([0-9]+(?:\.[0-9]+)?%|[A-F][+-]?)/i);
      if (fallbackMarks) {
        marks = fallbackMarks[1];
      }
    }

    // Clean up extracted data
    if (name) {
      name = name.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    }

    return {
      name: name || "Name not found",
      tuRegd: tuRegd || "Registration not found", 
      marks: marks || "Marks not found"
    };
  }
}
