const $  = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

const state = {
  projects: [],
  socials: []
};

async function getJSON(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return res.json();
}

function makeBadge(text) {
  const span = document.createElement('span');
  span.className = 'badge';
  span.textContent = text;
  return span;
}

function projectCard(p) {
  const el = document.createElement('article');
  el.className = 'project-card';
  el.dataset.tags = (p.tags || []).join(',').toLowerCase();

  el.innerHTML = `
    <div class="card-media">
      <img src="${p.image || 'assets/project-default.webp'}" alt="${p.title} preview" loading="lazy" decoding="async" />
    </div>
    <div class="card-body">
      <h3 class="card-title">${p.title}</h3>
      <p class="card-description">${p.summary || ''}</p>
      <div class="card-tags"></div>
    </div>
    <div class="card-actions">
      ${p.demo ? `<a class="card-btn card-btn-primary" href="${p.demo}" target="_blank" rel="noopener">View Project</a>` : ''}
      ${p.repo ? `<a class="card-btn card-btn-secondary" href="${p.repo}" target="_blank" rel="noopener">GitHub</a>` : ''}
    </div>`;

  const tags = $('.card-tags', el);
  (p.tags || []).forEach(t => {
    const img = document.createElement('img');
    img.className = 'shield-badge';
    img.src = `https://img.shields.io/badge/${encodeURIComponent(t)}-gray?style=flat-square&logo=${getLogoForTech(t)}&logoColor=white`;
    img.alt = t;
    img.loading = 'lazy';
    tags.appendChild(img);
  });
  return el;
}

function getLogoForTech(tech) {
  const logoMap = {
    'HTML': 'html5',
    'CSS': 'css3',
    'JavaScript': 'javascript',
    'Python': 'python',
    'Java': 'openjdk',
    'GitHub Actions': 'githubactions',
    'Discord JDA': 'discord',
    'DiscordJS': 'discord',
    'Discord.js': 'discord',
    'Riot API': 'riotgames',
    'RSS': 'rss',
    'MySQL': 'mysql',
    'PHP': 'php',
    'Drag & Drop': 'html5'
  };
  return logoMap[tech] || tech.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function renderProjects() {
  const featured = state.projects.filter(p => p.featured);
  const rest     = state.projects.filter(p => !p.featured);

  const featuredGrid = $('#featured-projects');
  const moreGrid = $('#more-projects');

  featuredGrid.innerHTML = '';
  moreGrid.innerHTML = '';

  featured.forEach((p, i) => {
    const card = projectCard(p);
    card.style.animationDelay = `${i * 0.1}s`;
    featuredGrid.appendChild(card);
  });

  rest.forEach((p, i) => {
    const card = projectCard(p);
    card.style.animationDelay = `${(featured.length + i) * 0.1}s`;
    moreGrid.appendChild(card);
  });
}

function renderSocials() {
  const list = $('#socials');
  list.innerHTML = '';
  state.socials.forEach(s => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'social-link';
    if (s.url) {
      link.href = s.url;
      link.target = '_blank';
      link.rel = 'noopener';
    } else {
      link.style.cursor = 'default';
    }
    link.title = s.label;
    link.setAttribute('aria-label', s.label);
    
    link.innerHTML = `
      <div class="social-icon">
        ${iconFor(s.kind)}
      </div>
      <span class="social-label">${s.label}</span>
    `;
    
    li.appendChild(link);
    list.appendChild(li);
  });
}

function iconFor(kind) {
  const map = {
    github: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-steam" viewBox="0 0 16 16"><path d="M.329 10.333A8.01 8.01 0 0 0 7.99 16C12.414 16 16 12.418 16 8s-3.586-8-8.009-8A8.006 8.006 0 0 0 0 7.468l.003.006 4.304 1.769A2.2 2.2 0 0 1 5.62 8.88l1.96-2.844-.001-.04a3.046 3.046 0 0 1 3.042-3.043 3.046 3.046 0 0 1 3.042 3.043 3.047 3.047 0 0 1-3.111 3.044l-2.804 2a2.223 2.223 0 0 1-3.075 2.11 2.22 2.22 0 0 1-1.312-1.568L.33 10.333Z"/><path d="M4.868 12.683a1.715 1.715 0 0 0 1.318-3.165 1.7 1.7 0 0 0-1.263-.02l1.023.424a1.261 1.261 0 1 1-.97 2.33l-.99-.41a1.7 1.7 0 0 0 .882.84Zm3.726-6.687a2.03 2.03 0 0 0 2.027 2.029 2.03 2.03 0 0 0 2.027-2.029 2.03 2.03 0 0 0-2.027-2.027 2.03 2.03 0 0 0-2.027 2.027m2.03-1.527a1.524 1.524 0 1 1-.002 3.048 1.524 1.524 0 0 1 .002-3.048"/></svg>',
    discord: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-discord" viewBox="0 0 16 16"><path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/></svg>',
    website: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-globe" viewBox="0 0 16 16"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/></svg>',
    twitter: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter" viewBox="0 0 16 16"> <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15"/></svg>',
    bluesky: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bluesky" viewBox="0 0 16 16"><path d="M3.468 1.948C5.303 3.325 7.276 6.118 8 7.616c.725-1.498 2.698-4.29 4.532-5.668C13.855.955 16 .186 16 2.632c0 .489-.28 4.105-.444 4.692-.572 2.04-2.653 2.561-4.504 2.246 3.236.551 4.06 2.375 2.281 4.2-3.376 3.464-4.852-.87-5.23-1.98-.07-.204-.103-.3-.103-.218 0-.081-.033.014-.102.218-.379 1.11-1.855 5.444-5.231 1.98-1.778-1.825-.955-3.65 2.28-4.2-1.85.315-3.932-.205-4.503-2.246C.28 6.737 0 3.12 0 2.632 0 .186 2.145.955 3.468 1.948"/></svg>',
    twitch: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitch" viewBox="0 0 16 16"><path d="M3.857 0 1 2.857v10.286h3.429V16l2.857-2.857H9.57L14.714 8V0zm9.714 7.429-2.285 2.285H9l-2 2v-2H4.429V1.143h9.142z"/><path d="M11.857 3.143h-1.143V6.57h1.143zm-3.143 0H7.571V6.57h1.143z"/></svg>',
    spotify: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-spotify" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.669 11.538a.5.5 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686m.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858m.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288"/></svg>',
    statsfm: '<svg viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="12" d="M39 71.87V170M96 22v148m57-53.087V170"></path></g></svg>',
    youtube: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-youtube" viewBox="0 0 16 16"><path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z"/></svg>',
    riot: '<svg fill="#ffffff" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>Riot Games icon</title><path d="M12.534 21.77l-1.09-2.81 10.52.54-.451 4.5zM15.06 0L.307 6.969 2.59 17.471H5.6l-.52-7.512.461-.144 1.81 7.656h3.126l-.116-9.15.462-.144 1.582 9.294h3.31l.78-11.053.462-.144.82 11.197h4.376l1.54-15.37Z"></path></g></svg>',
    steam: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-steam" viewBox="0 0 16 16"><path d="M.329 10.333A8.01 8.01 0 0 0 7.99 16C12.414 16 16 12.418 16 8s-3.586-8-8.009-8A8.006 8.006 0 0 0 0 7.468l.003.006 4.304 1.769A2.2 2.2 0 0 1 5.62 8.88l1.96-2.844-.001-.04a3.046 3.046 0 0 1 3.042-3.043 3.046 3.046 0 0 1 3.042 3.043 3.047 3.047 0 0 1-3.111 3.044l-2.804 2a2.223 2.223 0 0 1-3.075 2.11 2.22 2.22 0 0 1-1.312-1.568L.33 10.333Z"/><path d="M4.868 12.683a1.715 1.715 0 0 0 1.318-3.165 1.7 1.7 0 0 0-1.263-.02l1.023.424a1.261 1.261 0 1 1-.97 2.33l-.99-.41a1.7 1.7 0 0 0 .882.84Zm3.726-6.687a2.03 2.03 0 0 0 2.027 2.029 2.03 2.03 0 0 0 2.027-2.029 2.03 2.03 0 0 0-2.027-2.027 2.03 2.03 0 0 0-2.027 2.027m2.03-1.527a1.524 1.524 0 1 1-.002 3.048 1.524 1.524 0 0 1 .002-3.048"/></svg>',
    bungie: '<svg fill="#ffffff" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>destiny</title> <path d="M13.451 15.025q0.475 0.56 1.337 0.906c0.314 0.163 0.685 0.259 1.078 0.259h0c0.416-0.003 0.817-0.066 1.195-0.18l-0.030 0.008c0.262-0.070 0.492-0.173 0.7-0.308l-0.009 0.006c0.228-0.142 0.426-0.299 0.604-0.475l-0 0c0.306-0.295 0.565-0.637 0.766-1.013l0.011-0.022c0.164-0.336 0.259-0.731 0.259-1.148 0-0.021-0-0.042-0.001-0.063l0 0.003v-6.082c0-0.005 0-0.012 0-0.019 0-0.254-0.031-0.5-0.091-0.736l0.004 0.021c-0.218-0.676-0.607-1.246-1.116-1.678l-0.005-0.004q-0.776-0.647-1.898-0.733c-0.123-0.028-0.265-0.043-0.41-0.043s-0.287 0.016-0.423 0.046l0.013-0.002c-0.319 0.074-0.592 0.163-0.855 0.272l0.036-0.013c-0.604 0.264-1.102 0.678-1.459 1.196l-0.007 0.011c-0.325 0.492-0.518 1.095-0.518 1.744 0 0.024 0 0.048 0.001 0.072l-0-0.004v5.694c-0 0.005-0 0.011-0 0.017 0 0.162 0.016 0.32 0.046 0.473l-0.003-0.015c0.025 0.116 0.041 0.25 0.043 0.387l0 0.002c0.154 0.547 0.406 1.023 0.739 1.431l-0.006-0.007z"></path> <path d="M31.957 7.131c0.028-0.194 0.043-0.419 0.043-0.647s-0.016-0.453-0.046-0.672l0.003 0.025c-0.058-0.23-0.115-0.489-0.173-0.776-0.057-0.293-0.147-0.553-0.267-0.795l0.008 0.018c-0.229-0.463-0.473-0.858-0.748-1.229l0.015 0.021c-0.282-0.367-0.61-0.68-0.978-0.94l-0.014-0.009c-0.273-0.22-0.586-0.409-0.923-0.551l-0.026-0.010c-0.325-0.138-0.703-0.244-1.097-0.299l-0.024-0.003c-0.273-0.055-0.588-0.086-0.909-0.086-0.014 0-0.028 0-0.042 0h0.002c-0.366 0-0.724 0.031-1.073 0.092l0.037-0.005c-0.494 0.124-0.925 0.286-1.33 0.491l0.036-0.017c-0.44 0.219-0.807 0.434-1.159 0.67l0.037-0.023q-0.518 0.345-1.035 0.647c-0.307 0.182-0.675 0.37-1.056 0.535l-0.066 0.026-0.086 0.043v9.102c0 0.006 0 0.013 0 0.020 0 0.344-0.031 0.68-0.091 1.006l0.005-0.034c-0.063 0.344-0.153 0.648-0.27 0.938l0.011-0.032c-0.284 0.631-0.645 1.172-1.082 1.643l0.004-0.004c-0.444 0.465-0.973 0.843-1.565 1.109l-0.031 0.013c-0.201 0.103-0.443 0.205-0.694 0.29l-0.040 0.012c-0.241 0.082-0.518 0.129-0.806 0.129-0.005 0-0.009 0-0.014-0h0.001c-0.111 0.037-0.238 0.058-0.37 0.058-0.067 0-0.133-0.005-0.197-0.016l0.007 0.001c-0.189-0.027-0.408-0.043-0.63-0.043-0.006 0-0.012 0-0.018 0h0.001c-0.372-0.061-0.692-0.136-1.004-0.23l0.055 0.014c-0.329-0.102-0.615-0.234-0.879-0.398l0.016 0.009c-0.525-0.294-0.969-0.669-1.331-1.113l-0.007-0.008c-0.363-0.446-0.668-0.959-0.892-1.513l-0.014-0.040c-0.058-0.173-0.115-0.33-0.173-0.475-0.055-0.136-0.086-0.294-0.086-0.459 0-0.005 0-0.011 0-0.016v0.001q-0.086-0.647-0.086-0.647v-9.318c0-0.028-0.028-0.043-0.086-0.043q-0.431-0.259-0.776-0.431c-0.264-0.135-0.49-0.278-0.701-0.439l0.011 0.008q-0.518-0.259-0.992-0.518t-0.906-0.518c-0.399-0.208-0.861-0.372-1.347-0.469l-0.033-0.006c-0.264-0.050-0.567-0.078-0.877-0.078-0.208 0-0.412 0.013-0.614 0.038l0.024-0.002c-0.483 0.059-0.92 0.165-1.337 0.315l0.042-0.013c-0.431 0.158-0.803 0.377-1.127 0.652l0.005-0.004c-0.348 0.233-0.646 0.504-0.9 0.813l-0.006 0.007c-0.24 0.289-0.455 0.615-0.633 0.962l-0.014 0.030c-0.148 0.284-0.293 0.626-0.415 0.98l-0.017 0.055c-0.11 0.326-0.173 0.701-0.173 1.092 0 0.011 0 0.021 0 0.031v-0.002c-0.022 0.141-0.035 0.303-0.035 0.468 0 0.247 0.028 0.487 0.082 0.718l-0.004-0.021q0.129 0.561 0.302 1.078c0.195 0.445 0.426 0.828 0.699 1.177l-0.009-0.012c0.297 0.381 0.638 0.709 1.021 0.982l0.015 0.010 2.071 1.38c0.225 0.226 0.465 0.437 0.716 0.634l0.017 0.013c0.269 0.21 0.508 0.421 0.733 0.647l0.863 0.863c0.283 0.283 0.538 0.594 0.762 0.927l0.014 0.022q0.345 0.431 0.604 0.82t0.518 0.82c0.27 0.374 0.515 0.799 0.715 1.249l0.018 0.046q0.302 0.69 0.561 1.38 0.345 0.949 0.604 1.855c0.16 0.536 0.282 1.166 0.342 1.815l0.003 0.040c0.054 0.154 0.086 0.332 0.086 0.517v0c0 0.185 0.032 0.363 0.090 0.529l-0.003-0.011c0 0.244 0.016 0.483 0.046 0.718l-0.003-0.028c0.027 0.207 0.043 0.447 0.043 0.69v0l0.173 1.035c0.068 0.399 0.158 0.747 0.273 1.084l-0.014-0.048c0.129 0.443 0.306 0.83 0.529 1.184l-0.011-0.019c0.239 0.384 0.525 0.711 0.856 0.987l0.007 0.005c0.671 0.604 1.531 1.011 2.481 1.12l0.021 0.002c0.232 0.052 0.5 0.083 0.774 0.086l0.003 0c0.245-0 0.483-0.032 0.71-0.091l-0.020 0.004c0.009 0 0.019 0 0.029 0 0.331 0 0.647-0.063 0.937-0.179l-0.017 0.006q0.431-0.173 0.949-0.431c0.601-0.373 1.093-0.866 1.456-1.448l0.011-0.019c0.276-0.329 0.496-0.717 0.64-1.14l0.007-0.025c0.133-0.384 0.239-0.836 0.298-1.303l0.004-0.035c0.001-0.199 0.017-0.393 0.046-0.583l-0.003 0.022c0.026-0.168 0.042-0.362 0.043-0.559v-0.001q0.086-0.518 0.129-1.035c0.028-0.359 0.074-0.684 0.138-1.002l-0.009 0.053q0.086-0.518 0.173-1.078c0.064-0.411 0.154-0.775 0.273-1.125l-0.014 0.047q0.431-1.38 0.431-1.38l0.518-1.38q0.345-0.69 0.69-1.337c0.261-0.485 0.518-0.894 0.8-1.285l-0.023 0.034q0.518-0.604 0.992-1.165t0.992-1.165q0.345-0.259 0.647-0.518t0.561-0.518l0.69-0.518c0.2-0.154 0.427-0.297 0.665-0.42l0.025-0.012 0.863-0.604 0.863-0.69c0.232-0.234 0.445-0.487 0.635-0.758l0.012-0.018c0.193-0.273 0.354-0.587 0.467-0.923l0.008-0.026v0.086c0.157-0.35 0.277-0.756 0.342-1.181l0.003-0.027z"></path> </g></svg>'
  };
  return map[kind] || map.website;
}

function initScrollEffects() {
  // Add scrolled class to nav on scroll
  const nav = $('.floating-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Smooth scroll for nav links
  $$('.nav-link, .btn-primary, .btn-secondary').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = $(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

function sparkles() {
  const canvas = document.getElementById('sparkles');
  const ctx = canvas.getContext('2d');
  let w, h, t = 0; const dots = 80;
  function resize(){ w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
  addEventListener('resize', resize); resize();
  function rnd(a,b){ return Math.random()*(b-a)+a; }
  const stars = Array.from({length:dots},()=>({x:rnd(0,w),y:rnd(0,h),r:rnd(0.4,1.6),p:rnd(0,6.28)}));
  function draw(){ t+=0.02; ctx.clearRect(0,0,w,h); ctx.globalCompositeOperation='lighter';
    for(const s of stars){ const a=0.55+Math.sin(t+s.p)*0.45; ctx.fillStyle=`hsla(${200+Math.sin(s.p)*60} 100% 70% / ${a})`;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r+Math.sin(t+s.p)*0.4,0,Math.PI*2); ctx.fill(); }
    requestAnimationFrame(draw);
  }
  draw();
}

async function main() {
  sparkles();

  const [site, projects] = await Promise.all([
    getJSON('data/site.json'),
    getJSON('data/projects.json')
  ]);

  state.socials = site.socials || [];
  state.projects = projects || [];

  $('#site-title').textContent = site.title || 'timfernix';
  $('#site-tagline').textContent = site.tagline || '';

  renderProjects();
  renderSocials();
  initScrollEffects();

  document.documentElement.classList.remove('is-loading');
  document.documentElement.classList.add('is-loaded');
}

main().catch(err => {
  console.error(err);
  const featuredGrid = $('#featured-projects');
  if (featuredGrid) {
    featuredGrid.innerHTML = `<p>Could not load data. Check <code>data/*.json</code>.</p>`;
  }
});
