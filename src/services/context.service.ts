import { Injectable, signal, computed } from '@angular/core';

export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  type: 'system' | 'file' | 'drive';
  date: Date;
  active: boolean;
  link?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  
  // Protocolo de Padronização Documental (CONHECIMENTO ÚNICO E SOBERANO)
  private protocoloPadronizacaoText = `
    PROTOCOLO DE PADRONIZAÇÃO DOCUMENTAL (DVS PEROBAL) - IDENTIDADE VISUAL E PADRÃO TÉCNICO

    MISSÃO: Atuar como Oficial de Inteligência (Argos Panoptes) para a Diretoria de Vigilância em Saúde de Perobal/PR.

    PROTOCOLO DE SAÍDA (HTML A4):
    Todo documento deve ser um ARQUIVO ÚNICO HTML pronto para impressão A4.

    1. ESTRUTURA CSS OBRIGATÓRIA:
       - Fonte: @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
       - Variáveis: :root { --primary: #000; --accent: #0f172a; --page-width: 210mm; --page-height: 297mm; --margin: 20mm; }
       - Body: display: flex; flex-direction: column; align-items: center; gap: 30px; background: #f0f2f5;
       - Folha A4: .a4-page { width: 210mm; min-height: 297mm; padding: 20mm 25mm; background: white; box-shadow: 0 4px 15px rgba(0,0,0,0.1); position: relative; }
       - Impressão: @media print { body { display: block; background: white; margin: 0; padding: 0; gap: 0; } .a4-page { box-shadow: none; width: 100%; height: auto; page-break-after: always; margin: 0; border: none; } .print-btn { display: none; } }

    2. CABEÇALHO PADRÃO:
       - Esquerda: Brasão (https://i.postimg.cc/529vS7wJ/brasao-municipio.png) + "Prefeitura Municipal de Perobal" (H1) + "Secretaria Municipal de Saúde" (H2).
       - Direita: Logo Adm (https://i.ibb.co/4nPDxkqx/Logo-adminstr.png) + Data e Ref.

    3. RODAPÉ TÁTICO:
       - Visual na tela (div .footer-visual) no final de cada folha.
       - Automático na impressão (@page { @bottom-center { content: "Ref..."; } }).

    4. TOM DE VOZ:
       - Técnico, assertivo, baseado em evidências (Lei 8.080/90, Códigos Sanitários).
       - Use tabelas para dados e "caixas táticas" para destaques.
  `;

  // Signals for state management
  documents = signal<KnowledgeDocument[]>([
    // Apenas o documento essencial para a padronização
    {
      id: 'doc-001', // ID reiniciado para indicar a nova era
      title: 'Protocolo de Padronização Documental (DVS Perobal)',
      content: this.protocoloPadronizacaoText,
      type: 'system',
      date: new Date(),
      active: true
    }
  ]);

  // Computed signal that aggregates all active document contents
  activeContext = computed(() => {
    return this.documents()
      .filter(doc => doc.active)
      .map(doc => `--- DOCUMENTO: ${doc.title} ---\n${doc.content}\n----------------`)
      .join('\n\n');
  });

  addDocument(title: string, content: string, type: 'file' | 'drive' = 'file', link?: string) {
    this.documents.update(docs => [
      ...docs, 
      {
        id: `doc-${Date.now()}`,
        title,
        content,
        type,
        date: new Date(),
        active: true,
        link
      }
    ]);
  }

  updateDocument(id: string, title: string, content: string) {
    this.documents.update(docs => docs.map(d => 
      d.id === id ? { ...d, title, content } : d
    ));
  }

  removeDocument(id: string) {
    this.documents.update(docs => docs.filter(d => d.id !== id));
  }

  toggleDocument(id: string) {
    this.documents.update(docs => docs.map(d => 
      d.id === id ? { ...d, active: !d.active } : d
    ));
  }

  getReportContext(): string {
    return this.activeContext();
  }
}