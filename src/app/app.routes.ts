import { Routes } from '@angular/router';
import { WidgetComponent } from './features/widget/widget.component';

export const routes: Routes = [
  { path: '', component: WidgetComponent },
  { path: '**', redirectTo: '' },
];
