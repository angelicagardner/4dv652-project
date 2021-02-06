import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: '**',
    loadChildren: () => import('./modules/static/not-found/not-found.module').then(m => m.NotFoundModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        enableTracing: false,
        relativeLinkResolution: 'legacy'
      }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
