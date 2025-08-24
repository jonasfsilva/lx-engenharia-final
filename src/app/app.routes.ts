import { Routes } from '@angular/router';
import { BlogItemsComponent } from './blog-items/blog-items.component';
import { NewsInternaComponent } from "./news-interna/news-interna.component";
import { HomeComponent } from "./home/home.component"; // supondo que exista um Home


export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' }, // Home no "/"
  { path: 'blog', component: BlogItemsComponent },           // lista de posts
  { path: 'postagem/:slug', component: NewsInternaComponent }, // detalhe da postagem
  { path: '**', redirectTo: '', pathMatch: 'full' },          // fallback para Home
];
