import { Injectable, inject, signal } from '@angular/core';
import { GoogleGenAI } from "@google/genai";
import { ContextService } from './context.service';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private contextService = inject(ContextService);
  private ai: GoogleGenAI;
  
  // State for loading
  isLoading = signal<boolean>(false);

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] });
  }

  async sendMessage(userMessage: string): Promise<string> {
    this.isLoading.set(true);
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userMessage,
        config: {
          systemInstruction: this.contextService.getReportContext(),
        }
      });
      return response.text || "Desculpe, não consegui processar sua solicitação no momento.";
    } catch (error) {
      console.error('Erro na API Gemini:', error);
      return "Houve um erro ao comunicar com a inteligência do SIVIG. Verifique a chave de API.";
    } finally {
      this.isLoading.set(false);
    }
  }
}