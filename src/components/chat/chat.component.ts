import { Component, inject, signal, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-full bg-slate-50 relative">
      <header class="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span class="material-icons-outlined text-primary">psychology</span>
            IA SIVIG Assistant
          </h2>
          <p class="text-xs text-slate-500">Pergunte sobre metas, dados ou o projeto Argos Panoptes</p>
        </div>
        <button (click)="clearHistory()" class="text-slate-400 hover:text-slate-600 p-1">
          <span class="material-icons-outlined text-sm">restart_alt</span>
        </button>
      </header>

      <div class="flex-1 overflow-y-auto p-4 space-y-4" #scrollContainer>
        <!-- Welcome Message -->
        <div class="flex justify-start">
          <div class="max-w-[80%] bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700">
            <p>Olá! Sou a inteligência artificial do SIVIG. Como posso ajudar na gestão de saúde hoje?</p>
            <div class="mt-2 flex flex-wrap gap-2">
              <button (click)="quickAsk('Quais são as metas de vacinação?')" class="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full transition-colors">
                💉 Metas Vacinação
              </button>
              <button (click)="quickAsk('Explique o projeto Argos Panoptes')" class="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full transition-colors">
                👁️ Argos Panoptes
              </button>
              <button (click)="quickAsk('Quais as fases de implantação?')" class="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full transition-colors">
                📅 Fases
              </button>
            </div>
          </div>
        </div>

        @for (msg of messages(); track msg.id) {
          <div class="flex" [class.justify-end]="msg.role === 'user'" [class.justify-start]="msg.role === 'ai'">
            <div [class]="msg.role === 'user' 
                ? 'bg-primary text-white rounded-2xl rounded-tr-none' 
                : 'bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-none'"
                 class="max-w-[80%] p-3 shadow-sm text-sm whitespace-pre-line">
              {{ msg.text }}
            </div>
          </div>
        }

        @if (isLoading()) {
          <div class="flex justify-start animate-pulse">
            <div class="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
              <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
              <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        }
      </div>

      <div class="p-4 bg-white border-t border-slate-200">
        <div class="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
          <input 
            type="text" 
            [(ngModel)]="userInput" 
            (keydown.enter)="sendMessage()"
            placeholder="Digite sua pergunta..." 
            class="bg-transparent border-none outline-none text-sm text-slate-800 flex-1 placeholder:text-slate-400 w-full"
            [disabled]="isLoading()"
          >
          <button (click)="sendMessage()" [disabled]="!userInput() || isLoading()" class="text-primary hover:text-primary/80 disabled:opacity-50">
            <span class="material-icons-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ChatComponent {
  private geminiService = inject(GeminiService);
  
  messages = signal<{id: number, role: 'user' | 'ai', text: string}[]>([]);
  userInput = signal('');
  isLoading = this.geminiService.isLoading;
  
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor() {
    effect(() => {
      // Auto-scroll when messages change
      if (this.messages().length > 0 || this.isLoading()) {
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  scrollToBottom(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }

  async sendMessage() {
    const text = this.userInput().trim();
    if (!text) return;

    this.messages.update(prev => [...prev, { id: Date.now(), role: 'user', text }]);
    this.userInput.set('');

    const response = await this.geminiService.sendMessage(text);
    
    this.messages.update(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: response }]);
  }

  quickAsk(question: string) {
    this.userInput.set(question);
    this.sendMessage();
  }

  clearHistory() {
    this.messages.set([]);
  }
}