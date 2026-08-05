/* ==========================================================================
   LILAC SOLUTIONS - KACHI MEDIA MONITOR LOGIC
   Connected to Production Express REST API & Persistent Database
   ========================================================================== */

let postsData = [];
let isSimulating = false;
let simulateInterval = null;
let chartTrendInstance = null;
let chartSentimentInstance = null;
let chartPlatformsInstance = null;

const API_BASE = window.location.origin;

document.addEventListener("DOMContentLoaded", () => {
  fetchPostsAndInit();
  setupEventListeners();
});

async function fetchPostsAndInit() {
  try {
    const res = await fetch(`${API_BASE}/api/posts`);
    const json = await res.json();
    if (json.success && json.data) {
      postsData = json.data;
    }
  } catch (err) {
    console.warn("API Offline, falling back to local dataset", err);
    postsData = JSON.parse(localStorage.getItem("kachi_lilac_posts_data")) || [];
  }

  initDashboard();
}

function initDashboard() {
  renderKPIs();
  renderCharts();
  renderPostsList();
}

// KPI Calculation & Rendering
function renderKPIs() {
  const totalPosts = postsData.length;
  const totalLikes = postsData.reduce((acc, p) => acc + p.likes, 0);
  const totalShares = postsData.reduce((acc, p) => acc + p.shares, 0);
  const totalComments = postsData.reduce((acc, p) => acc + (p.comments ? p.comments.length : p.commentsCount), 0);
  const estimatedReach = Math.round((totalLikes * 24) + (totalShares * 90) + (totalPosts * 1400));

  const positivePosts = postsData.filter(p => p.sentiment === "positivo").length;
  const positivePercentage = Math.round((positivePosts / totalPosts) * 100) || 0;

  document.getElementById("kpiPosts").innerText = totalPosts;
  document.getElementById("kpiLikes").innerText = totalLikes.toLocaleString("es-AR");
  document.getElementById("kpiComments").innerText = totalComments.toLocaleString("es-AR");
  document.getElementById("kpiReach").innerText = (estimatedReach / 1000).toFixed(1) + "K";
  document.getElementById("kpiSentiment").innerHTML = `${positivePercentage}% <small>Positivo</small>`;
}

// Render Charts with Lilac Colors (#C598FE, #A855F7, #34D399, #FBBF24)
function renderCharts() {
  // Chart 1: Trend Line
  const ctxTrend = document.getElementById("chartTrend").getContext("2d");
  if (chartTrendInstance) chartTrendInstance.destroy();

  chartTrendInstance = new Chart(ctxTrend, {
    type: 'line',
    data: {
      labels: ['1 Ago', '2 Ago', '3 Ago', '4 Ago', '5 Ago (Hoy)', '6-10 Ago (Proy)', '27 Ago (Audiencia)'],
      datasets: [
        {
          label: 'Reacciones & Shares (Lilac)',
          data: [50, 110, 380, 720, totalLikesShares(), 1950, 3800],
          borderColor: '#C598FE',
          backgroundColor: 'rgba(197, 152, 254, 0.12)',
          fill: true,
          tension: 0.35,
          borderWidth: 3
        },
        {
          label: 'Alcance Estimado (k)',
          data: [3, 6, 20, 36, 48.5, 80, 160],
          borderColor: '#34D399',
          borderDash: [5, 5],
          fill: false,
          tension: 0.35,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } }
      },
      scales: {
        x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });

  // Chart 2: Sentiment Doughnut
  const ctxSentiment = document.getElementById("chartSentiment").getContext("2d");
  if (chartSentimentInstance) chartSentimentInstance.destroy();

  const posCount = postsData.filter(p => p.sentiment === "positivo").length;
  const neuCount = postsData.filter(p => p.sentiment === "neutro").length;
  const inqCount = postsData.filter(p => p.sentiment === "inquietud").length;

  chartSentimentInstance = new Chart(ctxSentiment, {
    type: 'doughnut',
    data: {
      labels: ['Positivo (Apoyo / DLE)', 'Neutro (Consultas)', 'Inquietud (Ambiental)'],
      datasets: [{
        data: [posCount, neuCount, inqCount],
        backgroundColor: ['#34D399', '#FBBF24', '#F87171'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Inter' } } }
      },
      cutout: '72%'
    }
  });

  // Chart 3: Platforms Breakdown
  const ctxPlatforms = document.getElementById("chartPlatforms").getContext("2d");
  if (chartPlatformsInstance) chartPlatformsInstance.destroy();

  const linkedinCount = postsData.filter(p => p.platform === "linkedin").length;
  const webCount = postsData.filter(p => p.platform === "web").length;

  chartPlatformsInstance = new Chart(ctxPlatforms, {
    type: 'bar',
    data: {
      labels: ['LinkedIn', 'Portales Web / Diarios'],
      datasets: [{
        label: 'Publicaciones',
        data: [linkedinCount, webCount],
        backgroundColor: ['#C598FE', '#34D399'],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
        y: { ticks: { color: '#94a3b8', precision: 0 }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });
}

function totalLikesShares() {
  return postsData.reduce((acc, p) => acc + p.likes + p.shares, 0);
}

// Render Feed List
function renderPostsList() {
  const container = document.getElementById("postsList");
  const searchVal = document.getElementById("searchInput").value.toLowerCase();
  const platformVal = document.getElementById("filterPlatform").value;
  const sentimentVal = document.getElementById("filterSentiment").value;

  const filtered = postsData.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchVal) || 
                          post.author.toLowerCase().includes(searchVal) || 
                          post.content.toLowerCase().includes(searchVal);
    const matchesPlatform = platformVal === "all" || post.platform === platformVal;
    const matchesSentiment = sentimentVal === "all" || post.sentiment === sentimentVal;
    return matchesSearch && matchesPlatform && matchesSentiment;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
        <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; margin-bottom: 10px; color: var(--color-primary);"></i>
        <p>No se encontraron publicaciones con los filtros seleccionados.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(post => `
    <div class="post-card">
      <div class="post-author">
        <div class="author-info">
          <div class="author-avatar">${post.author.charAt(0)}</div>
          <div class="author-name">
            <h4>${post.author}</h4>
            <span>${post.role || 'Medio de Comunicación'} • ${post.date}</span>
          </div>
        </div>
        <div class="platform-badge ${post.platform}">
          <i class="fa-brands ${post.platform === 'linkedin' ? 'fa-linkedin' : 'fa-globe'}"></i>
          ${post.platform === 'linkedin' ? 'LinkedIn' : 'Portal Web'}
        </div>
      </div>

      <div class="post-content">
        <h5>${post.title}</h5>
        <p>${post.content}</p>
      </div>

      <div class="post-meta">
        <div class="metrics-pills">
          <span title="Reacciones / Likes"><i class="fa-solid fa-thumbs-up text-lilac-light"></i> ${post.likes}</span>
          <span title="Compartidos"><i class="fa-solid fa-share-nodes text-lilac"></i> ${post.shares}</span>
          <span title="Comentarios"><i class="fa-solid fa-comments text-lilac"></i> ${post.comments ? post.comments.length : post.commentsCount}</span>
        </div>

        <div class="sentiment-tag ${post.sentiment}">
          ${getSentimentLabel(post.sentiment)}
        </div>
      </div>

      <div class="post-actions">
        <button class="btn btn-outline btn-sm" onclick="openCommentsModal('${post.id}')">
          <i class="fa-solid fa-comments"></i> Ver Comentarios (${post.comments ? post.comments.length : post.commentsCount})
        </button>
        <a href="${post.url}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Ir a la Fuente
        </a>
      </div>
    </div>
  `).join('');
}

function getSentimentLabel(sentiment) {
  if (sentiment === "positivo") return "🟢 Positivo / Apoyo";
  if (sentiment === "neutro") return "🟡 Neutro / Consulta";
  return "🔴 Inquietud Ambiental";
}

// Modal Handlers
function openCommentsModal(postId) {
  const post = postsData.find(p => p.id === postId);
  if (!post) return;

  document.getElementById("modalPostTitle").innerText = post.title;
  document.getElementById("modalPostSource").innerText = `${post.author} • ${post.platform.toUpperCase()}`;
  document.getElementById("modalPostSnippet").innerText = `"${post.content}"`;

  const commentsContainer = document.getElementById("modalCommentsList");
  if (!post.comments || post.comments.length === 0) {
    commentsContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.88rem;">No hay comentarios individuales registrados para esta nota aún.</p>`;
  } else {
    commentsContainer.innerHTML = post.comments.map(c => `
      <div class="comment-card">
        <div class="comment-header">
          <span class="comment-author">${c.author}</span>
          <span class="sentiment-tag ${c.sentiment}">${getSentimentLabel(c.sentiment)}</span>
        </div>
        <span class="comment-role">${c.role || 'Usuario LinkedIn'}</span>
        <p class="comment-body">"${c.text}"</p>
      </div>
    `).join('');
  }

  document.getElementById("commentsModal").classList.add("active");
}

function setupEventListeners() {
  document.getElementById("btnCloseCommentsModal").onclick = () => {
    document.getElementById("commentsModal").classList.remove("active");
  };

  document.getElementById("btnOpenAddModal").onclick = () => {
    document.getElementById("addPostModal").classList.add("active");
  };

  document.getElementById("btnCloseAddModal").onclick = () => {
    document.getElementById("addPostModal").classList.remove("active");
  };

  document.getElementById("btnCancelAdd").onclick = () => {
    document.getElementById("addPostModal").classList.remove("active");
  };

  document.getElementById("searchInput").oninput = renderPostsList;
  document.getElementById("filterPlatform").onchange = renderPostsList;
  document.getElementById("filterSentiment").onchange = renderPostsList;

  // Add Form Submit via API
  document.getElementById("addPostForm").onsubmit = async (e) => {
    e.preventDefault();

    const rawComments = document.getElementById("formComments").value.trim();
    const parsedComments = rawComments ? rawComments.split("\n").map(line => ({
      author: "Comentario Registrado",
      role: "Audiencia Pública / Redes",
      text: line,
      sentiment: document.getElementById("formSentiment").value
    })) : [];

    const newPostData = {
      author: document.getElementById("formSource").value.trim(),
      role: "Publicación Registrada",
      platform: document.getElementById("formPlatform").value,
      title: document.getElementById("formTitle").value.trim(),
      content: document.getElementById("formTitle").value.trim(),
      url: document.getElementById("formUrl").value.trim() || "#",
      likes: parseInt(document.getElementById("formLikes").value) || 0,
      shares: parseInt(document.getElementById("formShares").value) || 0,
      sentiment: document.getElementById("formSentiment").value,
      comments: parsedComments
    };

    try {
      const res = await fetch(`${API_BASE}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPostData)
      });
      const json = await res.json();
      if (json.success) {
        postsData.unshift(json.data);
      }
    } catch (err) {
      console.warn("API Error saving post, saving locally", err);
      newPostData.id = "post-" + Date.now();
      newPostData.date = new Date().toISOString().split('T')[0];
      postsData.unshift(newPostData);
    }

    initDashboard();
    document.getElementById("addPostModal").classList.remove("active");
    document.getElementById("addPostForm").reset();
  };

  // Simulation Toggle
  document.getElementById("btnToggleSimulate").onclick = () => {
    isSimulating = !isSimulating;
    const btn = document.getElementById("btnToggleSimulate");
    const status = document.getElementById("liveStatus");

    if (isSimulating) {
      btn.innerHTML = `<i class="fa-solid fa-pause"></i> Detener Simulación`;
      btn.classList.replace("btn-secondary", "btn-outline");
      status.innerHTML = `<span class="pulse-dot"></span> SIMULANDO TRÁFICO VIVO`;
      
      simulateInterval = setInterval(() => {
        const idx = Math.floor(Math.random() * postsData.length);
        postsData[idx].likes += Math.floor(Math.random() * 5) + 1;
        renderKPIs();
        renderCharts();
        renderPostsList();
      }, 2500);
    } else {
      btn.innerHTML = `<i class="fa-solid fa-bolt"></i> Simular Tráfico Vivo`;
      btn.classList.replace("btn-outline", "btn-secondary");
      status.innerHTML = `<span class="pulse-dot"></span> MONITOREO LILAC`;
      clearInterval(simulateInterval);
    }
  };

  // Export Data
  document.getElementById("btnExportData").onclick = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(postsData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lilac_kachi_media_monitoring_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };
}
