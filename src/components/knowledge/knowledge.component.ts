import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContextService, KnowledgeDocument } from '../../services/context.service';

@Component({
  selector: 'app-knowledge',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out forwards;
    }
  `],
  template: `
    <div class="p-6 h-full overflow-y-auto bg-slate-50">
      <header class="mb-8">
        <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span class="material-icons-outlined text-primary">folder_open</span>
          Base de Conhecimento
        </h2>
        <p class="text-slate-500">Gerencie os documentos e fontes de dados que alimentam a inteligência do SIVIG.</p>
      </header>

      <!-- Action Bar -->
      <div class="flex flex-wrap gap-4 mb-6">
        <label class="cursor-pointer bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
          <span class="material-icons-outlined text-sm">upload_file</span>
          Carregar Arquivo (.txt, .md, .json)
          <input type="file" class="hidden" (change)="onFileSelected($event)" accept=".txt,.md,.json,.csv">
        </label>

        <button (click)="connectToDrive()" [disabled]="isConnecting()" class="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
          @if (isConnecting()) {
            <span class="material-icons-outlined text-sm animate-spin">sync</span>
            Conectando...
          } @else {
            <span class="material-icons-outlined text-sm">add_to_drive</span>
            Google Drive
          }
        </button>
      </div>

      <!-- Filter Bar -->
      <div class="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <button (click)="setFilter('all')" 
                class="px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 flex items-center gap-1"
                [class.bg-slate-800]="filter() === 'all'"
                [class.text-white]="filter() === 'all'"
                [class.border-slate-800]="filter() === 'all'"
                [class.bg-white]="filter() !== 'all'"
                [class.text-slate-600]="filter() !== 'all'"
                [class.border-slate-200]="filter() !== 'all'"
                [class.hover:bg-slate-50]="filter() !== 'all'">
          Todos
          <span class="bg-white/20 px-1.5 rounded text-[10px]" [class.text-slate-500]="filter() !== 'all'">{{ counts().all }}</span>
        </button>

        <button (click)="setFilter('system')" 
                class="px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 flex items-center gap-1"
                [class.bg-slate-500]="filter() === 'system'"
                [class.text-white]="filter() === 'system'"
                [class.border-slate-500]="filter() === 'system'"
                [class.bg-white]="filter() !== 'system'"
                [class.text-slate-600]="filter() !== 'system'"
                [class.border-slate-200]="filter() !== 'system'"
                [class.hover:bg-slate-50]="filter() !== 'system'">
          <span class="material-icons-outlined text-[14px]">settings</span> Sistema
          <span class="bg-white/20 px-1.5 rounded text-[10px]" [class.text-slate-500]="filter() !== 'system'">{{ counts().system }}</span>
        </button>

        <button (click)="setFilter('file')" 
                class="px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 flex items-center gap-1"
                [class.bg-blue-600]="filter() === 'file'"
                [class.text-white]="filter() === 'file'"
                [class.border-blue-600]="filter() === 'file'"
                [class.bg-white]="filter() !== 'file'"
                [class.text-slate-600]="filter() !== 'file'"
                [class.border-slate-200]="filter() !== 'file'"
                [class.hover:bg-blue-50]="filter() !== 'file'">
          <span class="material-icons-outlined text-[14px]">description</span> Arquivos
          <span class="bg-white/20 px-1.5 rounded text-[10px]" [class.text-slate-500]="filter() !== 'file'">{{ counts().file }}</span>
        </button>

        <button (click)="setFilter('drive')" 
                class="px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 flex items-center gap-1"
                [class.bg-green-600]="filter() === 'drive'"
                [class.text-white]="filter() === 'drive'"
                [class.border-green-600]="filter() === 'drive'"
                [class.bg-white]="filter() !== 'drive'"
                [class.text-slate-600]="filter() !== 'drive'"
                [class.border-slate-200]="filter() !== 'drive'"
                [class.hover:bg-green-50]="filter() !== 'drive'">
          <span class="material-icons-outlined text-[14px]">cloud</span> Drive
          <span class="bg-white/20 px-1.5 rounded text-[10px]" [class.text-slate-500]="filter() !== 'drive'">{{ counts().drive }}</span>
        </button>
      </div>

      <!-- Drive Warning Toast -->
      @if (showDriveWarning()) {
        <div class="mb-6 p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-100 flex items-start gap-3 animate-fadeIn shadow-sm">
          <span class="material-icons-outlined mt-0.5">info</span>
          <div class="flex-1">
            <p class="font-bold text-sm">Integração Google Drive</p>
            <p class="text-xs mt-1 leading-relaxed">
              Para conectar uma pasta do Google Drive diretamente, é necessária <strong>autenticação OAuth2</strong> e configuração de backend seguro. 
              <br><br>
              Para utilizar o conhecimento desta aplicação agora, por favor faça upload dos arquivos de texto manualmente usando o botão <strong>"Carregar Arquivo"</strong> acima.
            </p>
          </div>
          <button (click)="showDriveWarning.set(false)" class="text-blue-400 hover:text-blue-700 transition-colors p-1 rounded-full hover:bg-blue-100">
            <span class="material-icons-outlined text-sm font-bold">close</span>
          </button>
        </div>
      }

      <!-- Documents Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (doc of filteredDocuments(); track doc.id) {
          <div class="bg-white rounded-xl p-5 shadow-sm border transition-all duration-300 group hover:shadow-md flex flex-col"
               [class.border-emerald-500]="doc.active"
               [class.border-slate-200]="!doc.active"
               [class.opacity-60]="!doc.active && editingId() !== doc.id"
               [class.ring-2]="editingId() === doc.id"
               [class.ring-primary]="editingId() === doc.id"
               [class.ring-opacity-50]="editingId() === doc.id">
            
            <div class="flex justify-between items-start mb-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                   [class.bg-blue-100]="doc.type === 'file'"
                   [class.text-blue-600]="doc.type === 'file'"
                   [class.bg-slate-100]="doc.type === 'system'"
                   [class.text-slate-600]="doc.type === 'system'"
                   [class.bg-green-100]="doc.type === 'drive'"
                   [class.text-green-600]="doc.type === 'drive'">
                <span class="material-icons-outlined">
                  @if(doc.type === 'system') { settings }
                  @else if(doc.type === 'drive') { cloud }
                  @else { description }
                </span>
              </div>
              
              <div class="flex gap-1">
                <button (click)="toggleDoc(doc.id)" 
                        class="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        [title]="doc.active ? 'Desativar' : 'Ativar'">
                  <span class="material-icons-outlined text-lg">
                    {{ doc.active ? 'check_circle' : 'radio_button_unchecked' }}
                  </span>
                </button>
                
                @if(doc.type !== 'system' && editingId() !== doc.id) {
                  <button (click)="startEditing(doc)" 
                          class="p-1.5 rounded hover:bg-amber-50 text-slate-400 hover:text-amber-500 transition-colors"
                          title="Editar">
                    <span class="material-icons-outlined text-lg">edit</span>
                  </button>
                  <button (click)="removeDoc(doc.id)" 
                          class="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" 
                          title="Remover">
                    <span class="material-icons-outlined text-lg">delete</span>
                  </button>
                }
                
                <!-- View Button for all docs -->
                <button (click)="viewDocument(doc)" 
                        class="p-1.5 rounded hover:bg-blue-50 text-slate-400 hover:text-blue-500 transition-colors"
                        title="Visualizar">
                  <span class="material-icons-outlined text-lg">visibility</span>
                </button>
              </div>
            </div>

            <!-- Title -->
            <div class="flex items-center gap-2 mb-1">
                <h3 class="font-bold text-slate-800 truncate flex-1" [title]="doc.title">{{ doc.title }}</h3>
            </div>
            
            <div class="mt-auto flex items-center justify-between text-xs text-slate-400 mb-2 pt-4">
              <span class="capitalize bg-slate-100 px-2 py-0.5 rounded">{{ doc.type }}</span>
              <span>{{ doc.date.toLocaleDateString() }}</span>
            </div>

            <!-- Content Preview -->
            <div class="text-xs bg-slate-50 p-2 rounded text-slate-500 line-clamp-3 font-mono border border-slate-100 h-[4.5em]">
                {{ doc.content.slice(0, 150) }}...
            </div>
          </div>
        }
      </div>

      @if (filteredDocuments().length === 0) {
        <div class="text-center py-20 animate-fadeIn">
          <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <span class="material-icons-outlined text-3xl">filter_list_off</span>
          </div>
          <h3 class="text-slate-500 font-medium">Nenhum documento encontrado.</h3>
        </div>
      }

      <!-- Document Viewer Modal -->
      @if (viewingDoc()) {
        <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn" (click)="closeViewer()">
          <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" (click)="$event.stopPropagation()">
            
            <div class="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span class="material-icons-outlined text-lg">article</span>
                </div>
                <div>
                  <h3 class="font-bold text-slate-800">{{ viewingDoc()?.title }}</h3>
                  <span class="text-xs text-slate-500 uppercase">{{ viewingDoc()?.type }}</span>
                </div>
              </div>
              <button (click)="closeViewer()" class="text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full p-2 transition-colors">
                <span class="material-icons-outlined">close</span>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto p-6 bg-white">
              <pre class="whitespace-pre-wrap font-mono text-xs md:text-sm text-slate-600 leading-relaxed max-w-none">{{ viewingDoc()?.content }}</pre>
            </div>

            <div class="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button (click)="closeViewer()" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                Fechar
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class KnowledgeComponent {
  private contextService = inject(ContextService);
  
  // State
  documents = this.contextService.documents;
  isConnecting = signal(false);
  showDriveWarning = signal(false);
  filter = signal<'all' | 'system' | 'file' | 'drive'>('all');

  // Editing State
  editingId = signal<string | null>(null);
  
  // Viewing State
  viewingDoc = signal<KnowledgeDocument | null>(null);

  // Computed Values
  filteredDocuments = computed(() => {
    const currentFilter = this.filter();
    const docs = this.documents();
    
    if (currentFilter === 'all') {
      return docs;
    }
    return docs.filter(d => d.type === currentFilter);
  });

  counts = computed(() => {
    const docs = this.documents();
    return {
      all: docs.length,
      system: docs.filter(d => d.type === 'system').length,
      file: docs.filter(d => d.type === 'file').length,
      drive: docs.filter(d => d.type === 'drive').length
    };
  });

  setFilter(type: 'all' | 'system' | 'file' | 'drive') {
    this.filter.set(type);
  }

  connectToDrive() {
    this.showDriveWarning.set(false);
    this.isConnecting.set(true);
    setTimeout(() => {
      this.isConnecting.set(false);
      this.showDriveWarning.set(true);
    }, 1500);
  }

  toggleDoc(id: string) {
    this.contextService.toggleDocument(id);
  }

  removeDoc(id: string) {
    if (confirm('Tem certeza que deseja remover este documento da base de conhecimento?')) {
      this.contextService.removeDocument(id);
    }
  }

  startEditing(doc: KnowledgeDocument) {
    // Basic implementation: In a real app this might open a modal for editing
    const newContent = prompt("Editar Conteúdo:", doc.content);
    if (newContent !== null) {
        this.contextService.updateDocument(doc.id, doc.title, newContent);
    }
  }

  // Viewer Methods
  viewDocument(doc: KnowledgeDocument) {
    this.viewingDoc.set(doc);
  }

  closeViewer() {
    this.viewingDoc.set(null);
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        this.contextService.addDocument(file.name, content, 'file');
        input.value = '';
      }
    };

    reader.readAsText(file);
  }
}
