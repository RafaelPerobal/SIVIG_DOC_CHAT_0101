import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 h-full overflow-y-auto bg-slate-50">
      <header class="mb-8">
        <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span class="material-icons-outlined text-primary">analytics</span>
          Visão em Tempo Real
        </h2>
        <p class="text-slate-500">Monitorando a saúde da população de Perobal - Projeto Argos Panoptes</p>
      </header>

      <!-- Top Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-emerald-500">
          <div class="text-sm text-slate-500 font-medium uppercase">Nascidos Vivos (Mês)</div>
          <div class="text-3xl font-bold text-slate-800 mt-1">7</div>
          <div class="text-xs text-emerald-600 mt-2 font-medium flex items-center">
            <span class="material-icons-outlined text-xs mr-1">arrow_upward</span> +2 vs mês anterior
          </div>
        </div>
        
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500">
          <div class="text-sm text-slate-500 font-medium uppercase">Gestantes 7+ Consultas</div>
          <div class="text-3xl font-bold text-slate-800 mt-1">89%</div>
          <div class="text-xs text-blue-600 mt-2 font-medium">Meta: 95% (Atenção)</div>
        </div>

        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-amber-500">
          <div class="text-sm text-slate-500 font-medium uppercase">Casos IST Notificados</div>
          <div class="text-3xl font-bold text-slate-800 mt-1">12</div>
          <div class="text-xs text-amber-600 mt-2 font-medium">Investigação em andamento</div>
        </div>

        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-red-500">
          <div class="text-sm text-slate-500 font-medium uppercase">Alertas de Surtos</div>
          <div class="text-3xl font-bold text-slate-800 mt-1">1</div>
          <div class="text-xs text-red-600 mt-2 font-medium">Síndrome Gripal (UBS Central)</div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        <!-- Vaccination Coverage Chart -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 class="text-lg font-bold text-slate-700 mb-4 flex justify-between">
            Cobertura Vacinal (< 1 ano)
            <span class="text-xs font-normal bg-slate-100 px-2 py-1 rounded text-slate-500">Fonte: SI-PNI / e-SUS AB</span>
          </h3>
          <div class="space-y-4">
            @for (v of vaccines(); track v.name) {
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="font-medium text-slate-700">{{v.name}}</span>
                  <span class="text-slate-500">{{v.value}}% / 95%</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-1000"
                       [class.bg-emerald-500]="v.value >= 95"
                       [class.bg-amber-500]="v.value >= 80 && v.value < 95"
                       [class.bg-red-500]="v.value < 80"
                       [style.width.%]="v.value">
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Alerts/Notifications List -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 class="text-lg font-bold text-slate-700 mb-4">Notificações Recentes</h3>
          <div class="space-y-4">
            @for (alert of alerts(); track alert.id) {
              <div class="flex gap-3 items-start pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                     [class.bg-red-100]="alert.level === 'high'"
                     [class.text-red-600]="alert.level === 'high'"
                     [class.bg-amber-100]="alert.level === 'medium'"
                     [class.text-amber-600]="alert.level === 'medium'"
                     [class.bg-blue-100]="alert.level === 'low'"
                     [class.text-blue-600]="alert.level === 'low'">
                  <span class="material-icons-outlined text-sm">{{alert.icon}}</span>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-slate-800">{{alert.title}}</h4>
                  <p class="text-xs text-slate-500 mt-1">{{alert.desc}}</p>
                  <span class="text-[10px] text-slate-400 mt-1 block">{{alert.time}}</span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Environmental / Water Quality -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
        <h3 class="text-lg font-bold text-slate-700 mb-4">Vigilância Ambiental (SISAGUA)</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-blue-50 rounded-lg text-center">
            <span class="text-sm text-blue-600 block mb-1">Cloro Residual</span>
            <span class="text-xl font-bold text-blue-800">0.8 mg/L</span>
            <span class="text-xs text-blue-400 block mt-1">Conforme</span>
          </div>
          <div class="p-4 bg-emerald-50 rounded-lg text-center">
            <span class="text-sm text-emerald-600 block mb-1">Turbidez</span>
            <span class="text-xl font-bold text-emerald-800">2.1 UT</span>
            <span class="text-xs text-emerald-400 block mt-1">Conforme</span>
          </div>
          <div class="p-4 bg-slate-50 rounded-lg text-center">
             <span class="text-sm text-slate-600 block mb-1">Coliformes</span>
             <span class="text-xl font-bold text-slate-800">Ausente</span>
             <span class="text-xs text-slate-400 block mt-1">100% das amostras</span>
          </div>
        </div>
      </div>

    </div>
  `
})
export class DashboardComponent {
  vaccines = signal([
    { name: 'Pentavalente', value: 92 },
    { name: 'Pneumocócica 10v', value: 88 },
    { name: 'Poliomielite', value: 96 },
    { name: 'Tríplice Viral (D1)', value: 85 },
    { name: 'Meningocócica C', value: 91 },
  ]);

  alerts = signal([
    { id: 1, title: 'Aumento S. Gripal', desc: 'Aumento de 15% na UBS Central.', time: 'Há 2 horas', level: 'high', icon: 'warning' },
    { id: 2, title: 'Foco de Dengue', desc: 'Bairro Jardim América, Q.12', time: 'Há 5 horas', level: 'medium', icon: 'bug_report' },
    { id: 3, title: 'Meta Pré-Natal', desc: 'Cobertura atingiu 89%, meta é 95%', time: 'Ontem', level: 'low', icon: 'trending_up' }
  ]);
}