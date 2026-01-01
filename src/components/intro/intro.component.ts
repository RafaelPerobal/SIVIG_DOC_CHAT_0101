import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 max-w-4xl mx-auto h-full overflow-y-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">SIVIG: Argos Panoptes</h1>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          Sistema Integrado de Vigilância e Gestão. Inteligência, Antecipação e Proteção para a nossa comunidade.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-4">
              <span class="material-icons-outlined">broken_image</span>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">O Problema: Silos de Dados</h3>
            <p class="text-slate-600 text-sm leading-relaxed">
              SIM, SINASC, SINAN e e-SUS AB operam isolados. Essa fragmentação força uma gestão reativa e atrasada, impedindo a visualização clara da saúde pública municipal.
            </p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
              <span class="material-icons-outlined">visibility</span>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">A Solução: Argos Panoptes</h3>
            <p class="text-slate-600 text-sm leading-relaxed">
              Assim como o gigante de 100 olhos da mitologia, o SIVIG nunca dorme. Integração total em Data Lake, Dashboards em tempo real e IA preditiva para gestão proativa.
            </p>
          </div>
        </div>
      </div>

      <div class="bg-slate-900 text-white rounded-3xl p-8 mb-12 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500 opacity-10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        
        <h2 class="text-2xl font-bold mb-6 relative z-10">Pilares do SIVIG</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div class="flex flex-col items-center text-center">
            <span class="material-icons-outlined text-4xl mb-3 text-emerald-400">hub</span>
            <h4 class="font-bold mb-1">Centralização</h4>
            <p class="text-xs text-slate-400">Integração de dados de múltiplas fontes do SUS.</p>
          </div>
          <div class="flex flex-col items-center text-center">
             <span class="material-icons-outlined text-4xl mb-3 text-emerald-400">insights</span>
            <h4 class="font-bold mb-1">Apoio à Decisão</h4>
            <p class="text-xs text-slate-400">Dashboards interativos e indicadores em tempo real.</p>
          </div>
          <div class="flex flex-col items-center text-center">
             <span class="material-icons-outlined text-4xl mb-3 text-emerald-400">psychology</span>
            <h4 class="font-bold mb-1">Inteligência (IA)</h4>
            <p class="text-xs text-slate-400">Alertas preditivos e automação de vigilância.</p>
          </div>
        </div>
      </div>

      <div class="text-center">
        <h3 class="text-xl font-bold text-slate-800 mb-6">Plano de Implantação</h3>
        <div class="flex flex-col md:flex-row justify-center items-start gap-4">
          
          <div class="flex-1 bg-white p-4 rounded-xl border border-slate-200 w-full">
            <span class="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">Mês 1-3</span>
            <h4 class="font-bold text-slate-800">Fase 1</h4>
            <p class="text-xs text-slate-500 mt-1">Estruturação, Data Lake e Conectores (SINAN, SIM).</p>
          </div>

          <div class="hidden md:block mt-8 text-slate-300">
            <span class="material-icons-outlined">arrow_forward</span>
          </div>

          <div class="flex-1 bg-white p-4 rounded-xl border border-slate-200 w-full">
            <span class="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">Mês 4-6</span>
            <h4 class="font-bold text-slate-800">Fase 2</h4>
            <p class="text-xs text-slate-500 mt-1">Dashboards, Modelos de Alerta e Treinamento.</p>
          </div>

          <div class="hidden md:block mt-8 text-slate-300">
             <span class="material-icons-outlined">arrow_forward</span>
          </div>

          <div class="flex-1 bg-white p-4 rounded-xl border border-slate-200 w-full">
             <span class="bg-emerald-100 text-emerald-600 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">Mês 7+</span>
            <h4 class="font-bold text-slate-800">Fase 3</h4>
            <p class="text-xs text-slate-500 mt-1">Lançamento oficial, Feedback e Expansão.</p>
          </div>

        </div>
      </div>
    </div>
  `
})
export class IntroComponent {}