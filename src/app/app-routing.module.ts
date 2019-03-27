import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  PortfolioComponent,
  EasterEggComponent,
  AboutComponent
} from '@app/components';

const routes: Routes = [
  { path: '', component: PortfolioComponent },
  { path: 'wp-login.php', component: EasterEggComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
