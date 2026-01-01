import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type DocType = 'oficio' | 'memorando' | 'portaria' | 'decreto' | 'lei' | 'aviso' | 'certificado' | 'generico';
type EditorMode = 'text' | 'html';

interface DocumentState {
  docType: DocType;
  editorMode: EditorMode;
  docNumber: string;
  docYear: string;
  docDept: string;
  docDate: string; // Salvo como ISO string
  docSubject: string;
  docRecipient: string;
  lawTitle: string;
  lawEmenta: string;
  lawPreamble: string;
  rawInput: string;
  docBody: string;
  signerName: string;
  signerRole: string;
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Pinyon+Script&display=swap');

    /* Container de Visualização */
    .preview-container {
      background-color: #64748b; /* Slate 500 */
      padding: 40px;
      overflow-y: auto;
      height: 100%;
      display: flex;
      justify-content: center;
    }

    /* Folha A4 */
    .a4-page {
      width: 210mm;
      min-height: 297mm;
      background: white;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
      padding: 1.5cm 2cm;
      font-family: 'Inter', sans-serif;
      color: #333;
      font-size: 11pt;
    }

    /* Layout de Tabela para Impressão (Garante repetição de header/footer) */
    .doc-table {
      width: 100%;
      border-collapse: collapse;
    }

    .doc-table thead, .doc-table tfoot {
      display: table-row-group; /* Default para tela */
    }

    /* Cabeçalho */
    .doc-header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #333;
      padding-bottom: 15px;
      margin-bottom: 30px;
    }

    .doc-logo-container {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .doc-logo {
      width: 60px;
      height: auto;
    }

    .doc-header-text h1 {
      font-size: 16px;
      font-weight: 700;
      margin: 0;
      color: #1a202c;
      text-transform: uppercase;
    }

    .doc-header-text p {
      font-size: 12px;
      margin: 0;
      color: #4a5568;
    }

    .doc-info {
      text-align: right;
      font-size: 11px;
      color: #4a5568;
    }

    /* Rodapé */
    .doc-footer-content {
      border-top: 1px solid #ccc;
      padding-top: 10px;
      margin-top: 20px;
      font-size: 9pt;
      color: #555;
      display: flex;
      justify-content: space-between;
    }

    /* Estilos de Conteúdo */
    .act-title {
        text-align: center;
        font-weight: bold;
        font-size: 14pt;
        margin-bottom: 20px;
        text-transform: uppercase;
    }

    .act-ementa {
      margin-left: 40%;
      text-align: justify;
      font-size: 10pt;
      font-style: italic;
      margin-bottom: 25px;
      border-left: 1px solid #ccc;
      padding-left: 10px;
    }

    .act-preamble {
        text-align: justify;
        margin-bottom: 20px;
        line-height: 1.5;
    }

    /* Estilo Certificado */
    .certificado-title {
      font-family: 'Pinyon Script', cursive;
      font-size: 48pt;
      color: #0f766e;
      text-align: center;
      margin-bottom: 30px;
    }
    
    .certificado-border {
      border: 10px double #0f766e;
      padding: 20px;
      margin: -10px; /* Compensar padding da página */
    }

    /* HTML User Content Styles */
    :host ::ng-deep .user-content table {
      width: 100%;
      border-collapse: collapse;
      font-family: Arial, sans-serif;
      font-size: 10pt;
      margin-top: 15px;
      margin-bottom: 25px;
    }

    :host ::ng-deep .user-content th,
    :host ::ng-deep .user-content td {
      border: 1px solid #999;
      padding: 6px 8px;
      text-align: left;
    }

    :host ::ng-deep .user-content th {
      background-color: #e0e0e0;
      font-weight: bold;
    }

    :host ::ng-deep .user-content h3 {
      font-size: 12pt;
      margin-top: 20px;
      margin-bottom: 10px;
      font-weight: bold;
      text-transform: uppercase;
    }

    :host ::ng-deep .user-content p, 
    :host ::ng-deep .user-content li {
        font-size: 12pt;
        line-height: 1.5;
        text-align: justify;
        margin-bottom: 10px;
    }

    /* Impressão */
    @media print {
      :host {
        display: block;
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background: white;
        z-index: 9999;
      }
      .no-print { display: none !important; }
      .preview-container { padding: 0; background: white; display: block; height: auto; }
      .a4-page { width: 100%; box-shadow: none; margin: 0; padding: 0; min-height: auto; }
      
      @page { size: A4; margin: 1.5cm; }
      
      /* Mágica para repetir cabeçalho e rodapé */
      .doc-table thead { display: table-header-group; }
      .doc-table tfoot { display: table-footer-group; }
      
      /* Evita quebra de página dentro de linhas */
      tr { page-break-inside: avoid; }
    }
  `],
  template: `
    <div class="flex flex-col lg:flex-row h-full bg-slate-100 overflow-hidden relative">
      
      <!-- Editor (Lado Esquerdo) -->
      <div class="w-full lg:w-1/3 bg-white border-r border-slate-200 overflow-y-auto no-print flex flex-col z-10 shadow-lg">
        <div class="p-4 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span class="material-icons-outlined text-primary">edit_document</span>
                Editor de Documentos
            </h2>
            <button (click)="resetDocument()" class="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors" title="Limpar e criar novo">
                Novo
            </button>
          </div>
          <p class="text-xs text-slate-500 flex items-center gap-1">
            <span class="material-icons-outlined text-[10px] text-emerald-500">cloud_done</span>
            Salvo automaticamente no navegador.
          </p>
        </div>

        <div class="p-6 space-y-6">
          
          <!-- Tipo -->
          <div class="space-y-3">
             <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Modelo</label>
             <select [ngModel]="docType()" (ngModelChange)="setDocType($event)" class="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                <optgroup label="Administrativo">
                  <option value="oficio">Ofício</option>
                  <option value="memorando">Memorando Interno</option>
                  <option value="aviso">Aviso / Comunicado</option>
                  <option value="certificado">Certificado</option>
                </optgroup>
                <optgroup label="Normativo">
                  <option value="portaria">Portaria</option>
                  <option value="decreto">Decreto Municipal</option>
                  <option value="lei">Projeto de Lei</option>
                </optgroup>
                <optgroup label="Outros">
                  <option value="generico">Documento em Branco</option>
                </optgroup>
             </select>
          </div>

          <!-- Identificação -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Cabeçalho</h3>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">
                    {{ isAct() ? 'Nº do Ato' : 'Número' }}
                </label>
                <input type="text" [(ngModel)]="docNumber" class="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">Ano</label>
                <input type="text" [(ngModel)]="docYear" class="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
              </div>
            </div>
            
            @if(!isAct() && docType() !== 'generico' && docType() !== 'certificado') {
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">Setor / Origem</label>
                <input type="text" [(ngModel)]="docDept" class="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
              </div>
            }

            <div>
               <label class="block text-xs font-medium text-slate-700 mb-1">Data</label>
               <input type="date" [ngModel]="docDate() | date:'yyyy-MM-dd'" (ngModelChange)="updateDate($event)" class="w-full p-2 text-sm border border-slate-300 rounded">
            </div>
          </div>

          <hr class="border-slate-100">

          <!-- Campos Específicos -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Estrutura</h3>
            
            @if(docType() === 'oficio' || docType() === 'memorando' || docType() === 'aviso') {
                <div>
                  <label class="block text-xs font-medium text-slate-700 mb-1">
                     {{ docType() === 'aviso' ? 'Título do Aviso' : 'Assunto' }}
                  </label>
                  <textarea [(ngModel)]="docSubject" rows="2" class="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"></textarea>
                </div>
                @if(docType() !== 'aviso') {
                  <div>
                    <label class="block text-xs font-medium text-slate-700 mb-1">Destinatário</label>
                    <input type="text" [(ngModel)]="docRecipient" class="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                  </div>
                }
            } @else if (isAct()) {
                <div>
                    <label class="block text-xs font-medium text-slate-700 mb-1">Título Completo</label>
                    <input type="text" [(ngModel)]="lawTitle" class="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                </div>
                <div>
                    <label class="block text-xs font-medium text-slate-700 mb-1">Ementa</label>
                    <textarea [(ngModel)]="lawEmenta" rows="4" class="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"></textarea>
                </div>
            }
            
            <!-- Editor de Conteúdo -->
            <div class="mt-4">
              <label class="block text-xs font-medium text-slate-700 mb-2">Corpo do Documento</label>
              <div class="flex items-center gap-1 border-b border-slate-200 mb-2">
                <button (click)="editorMode.set('text')" 
                        class="px-3 py-2 text-xs font-bold border-b-2 transition-colors"
                        [class.border-primary]="editorMode() === 'text'"
                        [class.text-primary]="editorMode() === 'text'"
                        [class.border-transparent]="editorMode() !== 'text'"
                        [class.text-slate-500]="editorMode() !== 'text'">
                   Texto Simples
                </button>
                <button (click)="editorMode.set('html')" 
                        class="px-3 py-2 text-xs font-bold border-b-2 transition-colors"
                        [class.border-primary]="editorMode() === 'html'"
                        [class.text-primary]="editorMode() === 'html'"
                        [class.border-transparent]="editorMode() !== 'html'"
                        [class.text-slate-500]="editorMode() !== 'html'">
                   HTML (Avançado)
                </button>
              </div>

              @if (editorMode() === 'text') {
                <textarea [(ngModel)]="rawInput" rows="12" class="w-full p-3 text-sm font-sans bg-white border border-slate-300 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none leading-relaxed placeholder:text-slate-300 shadow-inner" placeholder="Digite o conteúdo..."></textarea>
                <button (click)="generateHtml()" class="mt-2 w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                    <span class="material-icons-outlined text-sm">format_paint</span>
                    Atualizar Visualização
                </button>
              } @else {
                  <div class="relative">
                    <textarea [(ngModel)]="docBody" rows="15" class="w-full p-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none leading-relaxed"></textarea>
                    <div class="absolute bottom-2 right-2 text-[10px] text-slate-400 bg-white/80 px-1 rounded">HTML Mode</div>
                  </div>
                  <p class="text-[10px] text-slate-500 mt-1">
                    Edite o HTML diretamente para formatar tabelas, negrito e listas.
                  </p>
              }
            </div>
          </div>

          <!-- Assinatura -->
          <div class="space-y-3 pt-4 border-t border-slate-100">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Assinatura</h3>
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Signatário</label>
              <input type="text" [(ngModel)]="signerName" class="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Cargo</label>
              <input type="text" [(ngModel)]="signerRole" class="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
            </div>
          </div>

          <div class="pt-4 sticky bottom-0 bg-white pb-4">
            <button (click)="printDocument()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md group">
              <span class="material-icons-outlined group-hover:scale-110 transition-transform">picture_as_pdf</span>
              Imprimir / Salvar PDF
            </button>
            <p class="text-[10px] text-center text-slate-400 mt-2">Na janela de impressão, selecione "Salvar como PDF"</p>
          </div>
        </div>
      </div>

      <!-- Preview (Papel A4) -->
      <div class="flex-1 preview-container">
        
        <div class="a4-page">
          <!-- Tabela principal para garantir repetição de header/footer -->
          <table class="doc-table">
            
            <!-- CABEÇALHO REPETIDO -->
            <thead>
              <tr>
                <td>
                  <header class="doc-header-content">
                    <div class="doc-logo-container">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Brasao_Perobal_Parana.jpg/160px-Brasao_Perobal_Parana.jpg" 
                           class="doc-logo" 
                           alt="Brasão Municipal"
                           onerror="this.src='https://via.placeholder.com/60x80?text=Brasão'">
                      <div class="doc-header-text">
                        <h1>Prefeitura Municipal de Perobal</h1>
                        <p>Secretaria Municipal de Saúde – Vigilância em Saúde</p>
                      </div>
                    </div>
                    <div class="doc-info">
                      <strong>Perobal/PR, {{ formattedDate() }}</strong><br>
                      @if (docType() === 'generico' || docType() === 'certificado') {
                         <!-- Sem numeração -->
                      } @else if (isAct()) {
                         Ref: {{ displayTitle() }}
                      } @else {
                         {{ displayType() }} nº {{ docNumber() }}/{{ docYear() }} – {{ docDept() }}
                      }
                    </div>
                  </header>
                </td>
              </tr>
            </thead>

            <!-- CORPO DO DOCUMENTO -->
            <tbody>
              <tr>
                <td class="align-top py-4">
                  <div [class.certificado-border]="docType() === 'certificado'">
                    
                    @if (docType() === 'oficio' || docType() === 'memorando') {
                        <div style="font-family: 'Inter', sans-serif; font-size: 12pt; margin-bottom: 20px;">
                           <strong>Assunto:</strong> {{ docSubject() }}
                        </div>
                        <div style="font-family: 'Inter', sans-serif; font-size: 12pt; margin-bottom: 30px; line-height: 1.5;">
                           <p style="margin: 0; white-space: pre-line;">{{ docRecipient() }}</p>
                        </div>

                    } @else if (isAct()) {
                         <div class="act-title">{{ lawTitle() }}</div>
                         <div class="act-ementa">{{ lawEmenta() }}</div>
                         <div class="act-preamble">{{ lawPreamble() }}</div>

                    } @else if (docType() === 'aviso') {
                         <div class="act-title" style="margin-bottom: 30px; font-size: 16pt;">{{ docSubject() }}</div>

                    } @else if (docType() === 'certificado') {
                         <div class="certificado-title">Certificado</div>
                    }

                    <!-- Conteúdo HTML Injetado -->
                    <div class="user-content" [innerHTML]="docBody()"></div>

                    <!-- Assinatura (Fica no corpo para não repetir no footer) -->
                    <div class="mt-16 mb-8 text-center" style="font-family: 'Inter', sans-serif; font-size: 12pt; page-break-inside: avoid;">
                        @if(!isAct()) { <p class="mb-12">Atenciosamente,</p> } @else { <br><br> }
                        
                        <div style="border-top: 1px solid #333; display: inline-block; padding-top: 5px; min-width: 250px;">
                            <strong>{{ signerName() }}</strong><br>
                            {{ signerRole() }}
                        </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>

            <!-- RODAPÉ REPETIDO -->
            <tfoot>
              <tr>
                <td>
                  <div class="doc-footer-content">
                     <span>Município de Perobal - PR</span>
                     <span>
                        {{ isAct() ? lawTitle() : (docType() === 'generico' ? 'Documento Oficial' : displayType() + ' ' + docNumber() + '/' + docYear()) }}
                     </span>
                     <span>Vigilância em Saúde</span>
                  </div>
                </td>
              </tr>
            </tfoot>

          </table>
        </div>
      </div>

    </div>
  `
})
export class DocumentsComponent {
  // Configuração
  docType = signal<DocType>('oficio');
  editorMode = signal<EditorMode>('text');

  // Estado Geral
  docNumber = signal('09');
  docYear = signal('2025');
  docDept = signal('DVS/SMS');
  docDate = signal(new Date());
  
  // Estado Correspondência
  docSubject = signal('');
  docRecipient = signal('');
  
  // Estado Ato Normativo
  lawTitle = signal('');
  lawEmenta = signal('');
  lawPreamble = signal('');

  // Conteúdo
  rawInput = signal('');
  docBody = signal('');
  signerName = signal('');
  signerRole = signal('');

  private readonly STORAGE_KEY = 'sivig_current_document';

  // Helpers
  isAct = computed(() => ['portaria', 'decreto', 'lei'].includes(this.docType()));
  
  formattedDate = computed(() => {
    return this.docDate().toLocaleDateString('pt-BR', { 
      day: '2-digit', month: 'long', year: 'numeric' 
    });
  });

  // Templates
  templates: Record<string, any> = {
    oficio: {
      subject: 'Solicitação de [Assunto]',
      recipient: 'Ao Ilmo. Sr. [Nome]\n[Cargo]\n[Instituição]',
      text: `1. Introdução\n\nVenho por meio deste solicitar [descrição da solicitação] com o objetivo de [objetivo].\n\n2. Justificativa\n\nA medida justifica-se devido a [motivos técnicos ou legais].\n\n3. Pedido\n\nDiante do exposto, solicito as providências cabíveis.`,
      signer: 'RAFAEL AMARO SILVÉRIO',
      role: 'Diretor de Vigilância em Saúde'
    },
    memorando: {
      subject: 'Encaminhamento de Relatório',
      recipient: 'Ao Setor de Recursos Humanos',
      text: `Encaminho anexo a folha ponto dos servidores referentes ao mês de [Mês/Ano].\n\nAtenciosamente,`,
      signer: 'RAFAEL AMARO SILVÉRIO',
      role: 'Diretor de Vigilância em Saúde'
    },
    aviso: {
      subject: 'COMUNICADO GERAL',
      text: `<p>A Secretaria Municipal de Saúde informa a toda a população que, a partir do dia <strong>[Data]</strong>, o horário de atendimento da UBS Central será alterado.</p>
<p>Novo horário: <strong>07h00 às 19h00</strong>, sem intervalo para almoço.</p>
<p>Contamos com a compreensão de todos.</p>`,
      signer: 'A GERÊNCIA',
      role: 'Secretaria de Saúde'
    },
    certificado: {
      text: `<p style="text-align: center; font-size: 14pt; margin-top: 40px;">Certificamos que</p>
<h2 style="text-align: center; font-size: 24pt; margin: 20px 0; text-transform: uppercase;">[NOME DO PARTICIPANTE]</h2>
<p style="text-align: center; font-size: 14pt;">participou com êxito da capacitação sobre <strong>"Vigilância em Saúde e Controle de Vetores"</strong>, realizada nos dias 10 e 11 de Agosto de 2025, com carga horária total de 16 horas.</p>`,
      signer: 'NOME DO COORDENADOR',
      role: 'Coordenador de Capacitação'
    },
    portaria: {
      lawTitle: 'PORTARIA Nº [N]/2025',
      lawEmenta: 'Nomeia a Comissão de [Finalidade] e dá outras providências.',
      lawPreamble: 'O SECRETÁRIO MUNICIPAL DE SAÚDE, no uso de suas atribuições legais...',
      text: `<p><strong>Art. 1º.</strong> Ficam nomeados os seguintes servidores para compor a Comissão:</p><ul><li>Membro 1 - Presidente</li><li>Membro 2 - Secretário</li></ul><p><strong>Art. 2º.</strong> Esta Portaria entra em vigor na data de sua publicação.</p>`,
      signer: 'HERISON CLEIK DA SILVA LIMA',
      role: 'Secretário Municipal de Saúde'
    },
    decreto: {
      lawTitle: 'DECRETO Nº [N]/2025',
      lawEmenta: 'Regulamenta a Lei Municipal nº [X] que dispõe sobre [Assunto].',
      lawPreamble: 'O PREFEITO MUNICIPAL DE PEROBAL, no uso das atribuições que lhe confere a Lei Orgânica...',
      text: `<p><strong>Art. 1º.</strong> Fica aprovado o Regulamento de [Assunto], anexo a este Decreto.</p><p><strong>Art. 2º.</strong> Revogam-se as disposições em contrário.</p>`,
      signer: 'ALMIR DE ALMEIDA',
      role: 'Prefeito Municipal'
    },
    lei: {
      lawTitle: 'PROJETO DE LEI Nº [N]/2025',
      lawEmenta: 'Dispõe sobre [Assunto] e dá outras providências.',
      lawPreamble: 'A CÂMARA MUNICIPAL DE PEROBAL, Estado do Paraná, aprovou e eu, Prefeito Municipal, sanciono a seguinte Lei:',
      text: `<p><strong>Art. 1º.</strong> Fica instituído no âmbito do Município de Perobal o programa [Nome].</p><p><strong>Art. 2º.</strong> As despesas decorrentes desta Lei correrão por conta de dotações orçamentárias próprias.</p>`,
      signer: 'ALMIR DE ALMEIDA',
      role: 'Prefeito Municipal'
    },
    generico: {
        text: `Digite o conteúdo do documento aqui...`,
        signer: '',
        role: ''
    }
  };

  constructor() {
    this.loadState();

    // Auto-save effect
    effect(() => {
        const state: DocumentState = {
            docType: this.docType(),
            editorMode: this.editorMode(),
            docNumber: this.docNumber(),
            docYear: this.docYear(),
            docDept: this.docDept(),
            docDate: this.docDate().toISOString(),
            docSubject: this.docSubject(),
            docRecipient: this.docRecipient(),
            lawTitle: this.lawTitle(),
            lawEmenta: this.lawEmenta(),
            lawPreamble: this.lawPreamble(),
            rawInput: this.rawInput(),
            docBody: this.docBody(),
            signerName: this.signerName(),
            signerRole: this.signerRole()
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    });
  }

  loadState() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
        try {
            const state: DocumentState = JSON.parse(saved);
            this.docType.set(state.docType);
            this.editorMode.set(state.editorMode);
            this.docNumber.set(state.docNumber);
            this.docYear.set(state.docYear);
            this.docDept.set(state.docDept);
            this.docDate.set(new Date(state.docDate));
            this.docSubject.set(state.docSubject);
            this.docRecipient.set(state.docRecipient);
            this.lawTitle.set(state.lawTitle);
            this.lawEmenta.set(state.lawEmenta);
            this.lawPreamble.set(state.lawPreamble);
            this.rawInput.set(state.rawInput);
            this.docBody.set(state.docBody);
            this.signerName.set(state.signerName);
            this.signerRole.set(state.signerRole);
        } catch (e) {
            console.error('Erro ao carregar estado do documento:', e);
            this.setDocType('oficio');
        }
    } else {
        this.setDocType('oficio');
    }
  }

  resetDocument() {
    if(confirm('Tem certeza que deseja apagar o documento atual e começar um novo?')) {
        localStorage.removeItem(this.STORAGE_KEY);
        this.setDocType('oficio');
    }
  }

  setDocType(type: DocType) {
    this.docType.set(type);
    const tmpl = this.templates[type] || this.templates['generico'];

    // Preenche campos
    if (tmpl.subject) this.docSubject.set(tmpl.subject);
    if (tmpl.recipient) this.docRecipient.set(tmpl.recipient);
    if (tmpl.lawTitle) this.lawTitle.set(tmpl.lawTitle);
    if (tmpl.lawEmenta) this.lawEmenta.set(tmpl.lawEmenta);
    if (tmpl.lawPreamble) this.lawPreamble.set(tmpl.lawPreamble);
    
    this.signerName.set(tmpl.signer || '');
    this.signerRole.set(tmpl.role || '');

    // Decide se carrega texto puro ou HTML
    if (['portaria', 'decreto', 'lei', 'aviso', 'certificado'].includes(type)) {
        this.editorMode.set('html');
        this.docBody.set(tmpl.text);
        this.rawInput.set(''); 
    } else {
        this.editorMode.set('text');
        this.rawInput.set(tmpl.text);
        this.generateHtml();
    }
  }

  displayType() {
    switch(this.docType()) {
        case 'oficio': return 'Ofício';
        case 'memorando': return 'Memorando';
        case 'portaria': return 'Portaria';
        case 'decreto': return 'Decreto';
        case 'lei': return 'Lei';
        case 'aviso': return 'Aviso';
        case 'certificado': return 'Certificado';
        default: return 'Documento';
    }
  }

  displayTitle() {
      if (this.isAct()) return this.lawTitle();
      return `${this.displayType()} nº ${this.docNumber()}/${this.docYear()}`;
  }

  updateDate(val: string) {
    this.docDate.set(new Date(val + 'T12:00:00'));
  }

  generateHtml() {
    const text = this.rawInput();
    if (!text) return;

    const lines = text.split('\n');
    let htmlOutput = '';
    let inList = false;

    lines.forEach(line => {
        const trimmed = line.trim();
        
        if (!trimmed) {
            if (inList) { htmlOutput += '</ul>\n'; inList = false; }
            return;
        }

        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
            if (!inList) { htmlOutput += '<ul>\n'; inList = true; }
            const content = trimmed.substring(1).trim();
            htmlOutput += `  <li>${content}</li>\n`;
        } else {
            if (inList) { htmlOutput += '</ul>\n'; inList = false; }
            
            // Detecta títulos numéricos (1. Introdução)
            if (/^(\d+\.|[IVX]+\.)/.test(trimmed)) {
                htmlOutput += `<h3>${trimmed}</h3>\n`;
            } else {
                htmlOutput += `<p>${trimmed}</p>\n`;
            }
        }
    });

    if (inList) htmlOutput += '</ul>\n';
    this.docBody.set(htmlOutput);
  }

  printDocument() {
    window.print();
  }
}
