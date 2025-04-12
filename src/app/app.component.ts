import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'lx-engenharia';
  header: any;
  contato: any;
  showMenu = false;
  logosList: any = [];
  mapa: any;
  servico: any;
  norma: any;
  projeto: any;
  mecanico: any;
  clima: any;
  play: any;
  linha: any;
  civil: any;
  laudo: any;
  listTestemunhas: any;
  post: any;

  currentSlide: { [key: string]: number } = {};
  intervals: { [key: string]: any } = {};
  currentIndex = 0;
  currentIndexComenter = 0;
  currentTestimonialIndex: number = 0;
  currentSlideLogo = 0;
  contactForm: FormGroup;
  sliders: any[] = [];
  isMobile: boolean = false;

  imageBlocks: any[][] = []; // Blocos de 9 imagens cada
  visibleLogos: any[] = []; // Logos visíveis no momento

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.contactForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required]],
      phone: ["", Validators.required],
      company: ["", Validators.required],
      text: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchData();
    this.fetchContatos();
    this.fetchLogosList();
    this.fetchMap();
    this.fetchServicos();
    this.fetchNr12();
    this.fetchProjetos();
    this.fetchTopicosMecanicos();
    this.fetchClimatizacao();
    this.fetchPlayground();
    this.fetchTopicosLinha();
    this.fetchConstrucao();
    this.fetchLaudos();
    this.fetchTestemunhas();
    this.fetchNoticias();

    this.autoScroll();
    this.startAutoScroll();
  }

  formatSecondaryText(text: string): string {
    return text.replace(/\r\n/g, '<br>');
  }

  ngOnDestroy(): void {
    // Limpa todos os intervalos ao destruir o componente
    Object.keys(this.intervals).forEach((sliderId) => {
      clearInterval(this.intervals[sliderId]);
    });
  }

  // Função para dividir o array em blocos de 9 imagens
  chunkArray(arr: any[], size: number): any[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  // Função para avançar para o próximo bloco de logos
  nextSlideLogo(): void {
    if (this.currentSlideLogo < this.imageBlocks.length - 1) {
      this.currentSlideLogo++;
    }
    this.updateVisibleLogos();
  }

  // Função para voltar ao bloco anterior de logos
  prevSlideLogo(): void {
    if (this.currentSlideLogo > 0) {
      this.currentSlideLogo--;
    }
    this.updateVisibleLogos();
  }

  // Atualiza os logos visíveis com base no bloco atual
  updateVisibleLogos(): void {
    this.visibleLogos = this.imageBlocks[this.currentSlideLogo] || [];
  }

  // Função para iniciar o carrossel automático
  startAutoSlide(sliderId: string, slider: any): void {
    if (!this.intervals[sliderId] && slider?.images?.length > 0) {
      this.intervals[sliderId] = setInterval(() => {
        this.currentSlide[sliderId] = (this.currentSlide[sliderId] + 1) % slider.images.length;
        console.log(`Slider ${sliderId} moved to index ${this.currentSlide[sliderId]}`);
      }, 5000); // Intervalo de 5 segundos
    }
  }

  autoScroll() {
    const container = document.querySelector('.overflow-y-auto');
    if (container) {
      setInterval(() => {
        container.scrollTop += 1;
      }, 50);
    }
  }

  quebraLinha(){
    const formattedText = this.clima.secondary_text.replace(/\r\n/g, '<br>');
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  fetchData(): void {
    const ApiHeader = 'https://octopus-app-yiik3.ondigitalocean.app/lxengenharia/api/v1/menu-items/';
    this.http.get(ApiHeader).subscribe((response) => {
      this.header = response;
      console.log(this.header);
    });
  }

  fetchContatos(): void {
    const ApiContatos = 'https://octopus-app-yiik3.ondigitalocean.app/lxengenharia/api/v1/sites/';
    this.http.get(ApiContatos).subscribe((response) => {
      this.contato = response;
      console.log(this.contato);
    });
  }

  fetchLogosList(): void {
    const ApiLogos = 'https://octopus-app-yiik3.ondigitalocean.app/lxengenharia/api/v1/sections/atendemos-empresas-nacionais-e-multinacionais-em-todo-o-brasil/';
    this.http.get(ApiLogos).subscribe((response) => {
      this.logosList = response;
      console.log(this.logosList);

      // Dividir as imagens em blocos de 9
      if (this.logosList?.images) {
        this.imageBlocks = this.chunkArray(this.logosList.images, 9);
        this.updateVisibleLogos(); // Atualiza os logos visíveis
      }
    });
  }

  fetchMap(): void {
    const ApiMap = 'https://octopus-app-yiik3.ondigitalocean.app/lxengenharia/api/v1/sections/mapa/';
    this.http.get(ApiMap).subscribe((response) => {
      this.mapa = response;
      console.log(this.mapa);

      const sliderId = "mapa";
      if (this.mapa?.images?.length > 0) {
        this.currentSlide[sliderId] = 0;
        this.startAutoSlide(sliderId, this.mapa);
      }
    });
  }

  fetchServicos(): void {
    const ApiServicos = 'https://octopus-app-yiik3.ondigitalocean.app/lxengenharia/api/v1/sections/servicos/';
    this.http.get(ApiServicos).subscribe((response) => {
      this.servico = response;
      console.log(this.servico);
    });
  }

  fetchNr12(): void {
    const ApiNr12 = 'https://octopus-app-yiik3.ondigitalocean.app/lxengenharia/api/v1/sections/nr12/';
    this.http.get(ApiNr12).subscribe((response) => {
      this.norma = response;
      console.log(this.norma);

      const sliderId = "norma";
      if (this.norma?.images?.length > 0) {
        this.currentSlide[sliderId] = 0;
        this.startAutoSlide(sliderId, this.norma);
      }
    });
  }

  fetchProjetos(): void {
    const ApiProjetos = 'https://octopus-app-yiik3.ondigitalocean.app/lxengenharia/api/v1/sections/projetos-mecanicos/';
    this.http.get(ApiProjetos).subscribe((response) => {
      this.projeto = response;
      console.log(this.projeto);

      const sliderId = "projeto";
      if (this.projeto?.images?.length > 0) {
        this.currentSlide[sliderId] = 0;
        this.startAutoSlide(sliderId, this.projeto);
      }
    });
  }

  fetchTopicosMecanicos(): void {
    const ApiTopicosMecanicos = 'https://octopus-app-yiik3.ondigitalocean.app/lxengenharia/api/v1/sections/topicos-projetos-mecanicos/';
    this.http.get(ApiTopicosMecanicos).subscribe((response) => {
      this.mecanico = response;
      console.log(this.mecanico);
    });
  }

  fetchClimatizacao(): void {
    const ApiClimatizacao = 'https://octopus-app-yiik3.ondigitalocean.app/lxengenharia/api/v1/sections/projetos-climatizacao/';
    this.http.get(ApiClimatizacao).subscribe((response) => {
      this.clima = response;
      console.log(this.clima);

      const sliderId = "clima";
      if (this.clima?.images?.length > 0) {
        this.currentSlide[sliderId] = 0;
        this.startAutoSlide(sliderId, this.clima);
      }
    });
  }

  fetchPlayground(): void {
    const ApiPlayground = 'https://octopus-app-yiik3.ondigitalocean.app/lxengenharia/api/v1/sections/projetos-linha-de-vida-rigida/';
    this.http.get(ApiPlayground).subscribe((response) => {
      this.play = response;
      console.log(this.play);

      const sliderId = "play";
      if (this.play?.images?.length > 0) {
        this.currentSlide[sliderId] = 0;
        this.startAutoSlide(sliderId, this.play);
      }
    });
  }

  fetchTopicosLinha(): void {
    const ApiTopicosLinha = 'https://octopus-app-yiik3.ondigitalocean.app/lxengenharia/api/v1/sections/topicos-linha-de-vida/';
    this.http.get(ApiTopicosLinha).subscribe((response) => {
      this.linha = response;
      console.log(this.linha);
    });
  }

  fetchConstrucao(): void {
    const ApiConstrucao = 'https://octopus-app-yiik3.ondigitalocean.app/lxengenharia/api/v1/sections/projetos-de-ponto-de-ancoragem/';
    this.http.get(ApiConstrucao).subscribe((response) => {
      this.civil = response;
      console.log(this.civil);
    });
  }

  fetchLaudos(): void {
    const ApiLaudos = 'https://octopus-app-yiik3.ondigitalocean.app/lxengenharia/api/v1/sections/laudos-e-inspecoes-tecnicas/';
    this.http.get(ApiLaudos).subscribe((response) => {
      this.laudo = response;
      console.log(this.laudo);

      const sliderId = "laudo";
      if (this.laudo?.images?.length > 0) {
        this.currentSlide[sliderId] = 0;
        this.startAutoSlide(sliderId, this.laudo);
      }
    });
  }

  fetchTestemunhas(): void {
    const ApiTestemunhas = 'https://octopus-app-yiik3.ondigitalocean.app/lxengenharia/api/v1/testimonials/';
    this.http.get(ApiTestemunhas).subscribe((response) => {
      this.listTestemunhas = response;
      console.log(this.listTestemunhas);
    });
  }

  fetchNoticias(): void {
    const ApiNoticias = 'https://octopus-app-yiik3.ondigitalocean.app/lxengenharia/api/v1/posts/';
    this.http.get(ApiNoticias).subscribe((response) => {
      this.post = response;
      console.log(this.post);
    });
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768; // Define mobile breakpoint
  }

  nextLogo() {
    this.currentIndex = (this.currentIndex + 1) % this.logosList.length;
    this.updateVisibleLogos();
  }

  prevLogo() {
    this.currentIndex =
      (this.currentIndex - 1 + this.logosList.length) % this.logosList.length;
    this.updateVisibleLogos();
  }

  startAutoScroll() {
    setInterval(() => {
      this.nextLogo();
    }, 3000);
  }

  prevTestimonial() {
    this.currentTestimonialIndex =
      this.currentTestimonialIndex > 0
        ? this.currentTestimonialIndex - 1
        : this.listTestemunhas.length - 1;
  }

  nextTestimonial() {
    this.currentTestimonialIndex =
      this.currentTestimonialIndex < this.listTestemunhas.length - 1
        ? this.currentTestimonialIndex + 1
        : 0;
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log("Form Data:", this.contactForm.value); // Log the form data
      this.http
        .post(
          "https://octopus-app-yiik3.ondigitalocean.app/lxengenharia/api/v1/contacts/",
          this.contactForm.value
        )
        .subscribe(
          (response) => {
            console.log("Message sent successfully:", response);
            alert("Mensagem enviada com sucesso!");
            this.contactForm.reset();
          },
          (error) => {
            console.error("Error sending message:", error);
            alert(
              "Erro ao enviar mensagem. Verifique os dados e tente novamente."
            );
          }
        );
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.");
    }
  }
}