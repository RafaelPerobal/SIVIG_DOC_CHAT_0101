import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Goal {
  area: string;
  description: string;
  indicator: string;
  system: string;
  target: number;
  current: number;
  status: 'good' | 'warning' | 'critical';
}

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 h-full overflow-y-auto">
      <h2 class="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
        <span class="material-icons-outlined text-primary">flag</span>
        Metas Estratégicas
      </h2>
      <p class="text-slate-500 mb-6">Monitoramento do Plano Municipal de Saúde</p>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-600">
            <thead class="bg-slate-50 text-slate-800 font-bold uppercase text-xs border-b border-slate-200">
              <tr>
                <th class="px-6 py-4">Área</th>
                <th class="px-6 py-4">Meta Estratégica</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4 text-center">Progresso</th>
                <th class="px-6 py-4">Sistema Fonte</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (goal of goals(); track goal.description) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 font-medium text-slate-800">{{goal.area}}</td>
                  <td class="px-6 py-4 max-w-xs">{{goal.description}}</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [class.bg-emerald-100]="goal.status === 'good'"
                      [class.text-emerald-800]="goal.status === 'good'"
                      [class.bg-amber-100]="goal.status === 'warning'"
                      [class.text-amber-800]="goal.status === 'warning'"
                      [class.bg-red-100]="goal.status === 'critical'"
                      [class.text-red-800]="goal.status === 'critical'">
                      <span class="w-1.5 h-1.5 rounded-full"
                        [class.bg-emerald-500]="goal.status === 'good'"
                        [class.bg-amber-500]="goal.status === 'warning'"
                        [class.bg-red-500]="goal.status === 'critical'"></span>
                      {{ goal.status === 'good' ? 'Atingida' : (goal.status === 'warning' ? 'Em Andamento' : 'Crítico') }}
                    </span>
                  </td>
                  <td class="px-6 py-4 w-48">
                    <div class="flex items-center gap-2">
                      <div class="flex-1 bg-slate-200 rounded-full h-2">
                        <div class="h-2 rounded-full" 
                             [style.width.%]="(goal.current / goal.target) * 100"
                             [class.bg-emerald-500]="goal.status === 'good'"
                             [class.bg-amber-500]="goal.status === 'warning'"
                             [class.bg-red-500]="goal.status === 'critical'">
                        </div>
                      </div>
                      <span class="text-xs font-bold">{{goal.current}}%</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-xs font-mono text-slate-500 bg-slate-50/50">
                    {{goal.system}}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class GoalsComponent {
  goals = signal<Goal[]>([
    {
      area: 'Epidemiológica',
      description: '100% de Cobertura Vacinal (Penta, Polio, etc) em < 2 anos',
      indicator: 'Cobertura Vacinal',
      system: 'SI-PNI / e-SUS',
      target: 100,
      current: 92,
      status: 'warning'
    },
    {
      area: 'Epidemiológica',
      description: 'Investigar 100% dos casos de Sífilis, HIV, Dengue, TB',
      indicator: '% Notificações Encerradas',
      system: 'SINAN',
      target: 100,
      current: 78,
      status: 'critical'
    },
    {
      area: 'Saúde da Criança',
      description: '7 consultas de puericultura no 1º ano em 95% das crianças',
      indicator: '% Crianças Acompanhadas',
      system: 'SINASC / e-SUS',
      target: 95,
      current: 89,
      status: 'warning'
    },
    {
      area: 'Ambiental',
      description: '4 ciclos de visitas para controle da dengue (80% imóveis)',
      indicator: 'Cobertura de Visitas',
      system: 'SINAN / e-SUS',
      target: 80,
      current: 85,
      status: 'good'
    },
    {
      area: 'Ambiental',
      description: '100% do plano de amostragem de qualidade da água',
      indicator: 'Amostras Coletadas',
      system: 'SISAGUA',
      target: 100,
      current: 100,
      status: 'good'
    },
    {
      area: 'Sanitária',
      description: 'Inspeção em 100% de estabelecimentos de alto risco',
      indicator: '% Inspeções Realizadas',
      system: 'SIEVISA',
      target: 100,
      current: 94,
      status: 'warning'
    }
  ]);
}