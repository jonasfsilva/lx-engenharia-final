import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, RouterLink, RouterLinkActive } from "@angular/router";
import { Meta, Title } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { NewsService } from "../blog-items/posts.service";

@Component({
  selector: "app-news-interna",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: "./news-interna.component.html",
  styleUrls: ["./news-interna.component.css"],
})
export class NewsInternaComponent implements OnInit {
  newsSlug: string | null = null;
  newsDetail: any = null;
  otherNews: any[] = [];
  currentUrl: string = "";
  expanded = false;
  header: any;
  contato: any;
  showMenu = false;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private metaService: Meta,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.newsSlug = params.get("slug");
      if (this.newsSlug) {
        this.newsDetail = null;
        this.loadNewsDetail(this.newsSlug);
        this.loadOtherNews();
      }
      this.currentUrl = this.generateCurrentUrl();
    });
    this.scrollToTop();
  }

  loadNewsDetail(newsId: string): void {
    this.newsService.getNewsBySlug(newsId).subscribe(
      (data) => {
        this.newsDetail = data;
        this.updateMetaTags();
        this.preloadLCPImage();
      },
      (error) => {
        console.error("Error loading news:", error);
      }
    );
  }

  preloadLCPImage(): void {
    const imageUrl = this.newsDetail?.imageUrl;
    if (imageUrl) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = imageUrl;
      link.as = "image";
      document.head.appendChild(link);
    }
  }

  updateMetaTags(): void {
    if (this.newsDetail) {
      const url = `${window.location.origin}/postagem/${this.newsSlug}`;
      this.titleService.setTitle(this.newsDetail.title);
      this.metaService.updateTag({ property: "og:title", content: this.newsDetail.title });
      this.metaService.updateTag({ property: "og:description", content: this.newsDetail.description });
      this.metaService.updateTag({ property: "og:image", content: this.newsDetail.imageUrl });
      this.metaService.updateTag({ property: "og:url", content: url });
    }
  }

  shareOnFacebook(): void {
    const currentUrl = this.generateCurrentUrl();
    const encodedUrl = encodeURIComponent(currentUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank");
  }

  generateCurrentUrl(): string {
    const baseUrl = window.location.origin;
    const path = this.route.snapshot.url.map((segment) => segment.path).join("/");
    return `${baseUrl}/${path}`;
  }

  shareOnWhatsApp(): void {
    const currentUrl = this.generateCurrentUrl();
    const encodedUrl = encodeURIComponent(currentUrl);
    window.open(`https://api.whatsapp.com/send?text=${encodedUrl}`, "_blank");
  }

  loadOtherNews(): void {
    this.newsService.getPosts().subscribe(
      (data) => (this.otherNews = data),
      (error) => console.error("Erro ao carregar outras postagens:", error)
    );
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  toggleMenu() {
    this.expanded = !this.expanded;
  }
}
