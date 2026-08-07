# Academia do Drone — Landing Page

Site reconstruído a partir do export original (`legacy/index-original-bundle.html`,
um pacote "bundlado" gerado por um artifact builder). Esta versão é HTML/CSS/JS
puro, sem dependências de runtime proprietário ou de React via CDN — mais fácil
de hospedar, versionar e editar.

## O que mudou

- **Header redesenhado**: logo (brasão "Academia do Drone / Braéro") ampliada,
  posicionada "vazando" do header branco para dentro do hero azul; menu novo
  (Depoimentos, Avaliações, O Curso, Quero Conhecer) + botão pill "Fale Conosco"
  (WhatsApp), com menu hambúrguer em telas menores.
- **Mobile refeito**: layout mobile-first do zero (breakpoints, menu em drawer,
  CTA fixo no rodapé em telas pequenas, geometria da logo/hero recalculada por
  breakpoint) em vez de apenas adaptar o header antigo.
- **Novas seções**: Depoimentos e Avaliações (ver placeholders abaixo).
- **Contador "Próxima turma em"**: saiu do header e foi para dentro do Hero.

## Estrutura

```
index.html          página única
css/styles.css       design tokens + estilos (mobile-first)
js/main.js            menu mobile, contador, máscara de telefone, validação
                       de formulário, modal de lead, integração WhatsApp/VTurb
assets/images/         logo, selos (DECEA/MAPA/ANAC/ANATEL), foto do piloto
assets/fonts/          Renogare Soft + Manrope (self-hosted)
legacy/                bundle original (referência) + servidor local de teste
```

## ⚠️ Placeholders para revisar antes de publicar

1. **Número de WhatsApp** — `js/main.js`, constante `WHATSAPP_NUMBER`
   (hoje `"5500000000000"`, o mesmo placeholder do arquivo original).
2. **Depoimentos** (seção `#depoimentos`) — 3 depoimentos ilustrativos, marcados
   com um aviso na própria página. Substituir por relatos reais de alunos.
3. **Avaliações** (seção `#avaliacoes`) — nota 4.9 e distribuição de estrelas
   são ilustrativas. Atualizar com números reais (Google, redes sociais etc.).
4. **Vídeo do Hero** — o player VTurb é montado com o mesmo `player id`/conta do
   arquivo original; confirmar se é o vídeo certo para esta campanha.
5. **Data da próxima turma** — contador aponta para 15/08/2026 23:59 (horário
   de Brasília), igual ao original; ajustar em `COUNTDOWN_TARGET` (`js/main.js`).

## Rodar localmente

Qualquer servidor estático funciona, por exemplo:

```
npx serve .
```

ou, no Windows sem Node instalado, o script incluso:

```
powershell -File legacy\serve.ps1
```
(serve em http://localhost:8877/)
