import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { NewsService } from "./posts.service";
import { CleanHtmlPipe } from "./clean-html.pipe";

@Component({
  selector: "app-blog-items",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    CleanHtmlPipe,
  ],
  templateUrl: "./blog-items.component.html",
  styleUrls: ["./blog-items.component.css"],
})
export class BlogItemsComponent implements OnInit {
  posts: any[] = [];
  expanded = false;
  loading = true;   // 👈 estado de carregamento
  header: any;
  contato: any;
  showMenu = false;
  error: string | null = null;

  constructor(private router: Router, private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  private loadPosts(): void {
    this.newsService.getPosts().subscribe({
      next: (response) => {
        this.posts = Array.isArray(response) ? response.slice(0, 4) : [];
        this.loading = false;
      },
      error: (err) => {
        console.error("Erro ao carregar postagens:", err);
        this.error = "Não foi possível carregar as postagens.";
        this.loading = false;
      },
    });
  }

  toggleMenu(): void {
    this.expanded = !this.expanded;
  }

  goToPost(slug: string): void {
    this.router.navigate(["/postagem", slug]);
  }
}
