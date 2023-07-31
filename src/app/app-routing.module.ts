import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { HomepageV2Component } from './homepage-v2/homepage-v2.component';

const routes: Routes = [
  { path: 'main', component: HomepageV2Component },
  { path: '', redirectTo: '/main', pathMatch: 'full' }, // redirect to `homepage`
  // { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
