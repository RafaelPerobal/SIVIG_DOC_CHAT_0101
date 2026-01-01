import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChatComponent } from './components/chat/chat.component';
import { IntroComponent } from './components/intro/intro.component';
import { GoalsComponent } from './components/goals/goals.component';
import { KnowledgeComponent } from './components/knowledge/knowledge.component';
import { DocumentsComponent } from './components/documents/documents.component';

type View = 'intro' | 'dashboard' | 'goals' | 'chat' | 'knowledge' | 'documents';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DashboardComponent, ChatComponent, IntroComponent, GoalsComponent, KnowledgeComponent, DocumentsComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  currentView = signal<View>('intro');
  isSidebarOpen = signal(false); // Mobile toggle
  isCollapsed = signal(false); // Desktop toggle

  setView(view: View) {
    this.currentView.set(view);
    this.isSidebarOpen.set(false); // Fecha sidebar no mobile ao clicar
  }

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  toggleCollapse() {
    this.isCollapsed.update(v => !v);
  }
}
