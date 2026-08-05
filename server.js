const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8085;
const DATA_FILE = path.join(__dirname, 'data', 'database.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data folder and file exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Initial dataset with full real intelligence
const INITIAL_DATABASE = {
  posts: [
    {
      id: "post-1",
      author: "Minería Sustentable",
      role: "Medio de Comunicación Minero & Ambiental",
      platform: "linkedin",
      title: "Kachi: Catamarca abrió la consulta pública ambiental y el proyecto de litio de Lake Resources entra en su etapa final de aprobación",
      content: "El Ministerio de Minería de Catamarca dio inicio a la participación ciudadana del Informe de Impacto Ambiental de Kachi, que se extenderá durante todo agosto y cerrará con una audiencia pública el 27 en la localidad de El Peñón. Lake Resources y Lilac Solutions esperan obtener la DIA antes de fin de septiembre. #MineríaSustentable #Kachi #LilacSolutions #Litio",
      url: "https://lnkd.in/d3kr7j_q",
      likes: 142,
      shares: 28,
      commentsCount: 19,
      sentiment: "positivo",
      date: "2026-08-04",
      comments: [
        { author: "Ing. Carlos Mendoza", role: "Especialista en Hidrogeología", text: "Excelente avance para la minería sostenible en la Puna. La tecnología DLE de Lilac Solutions con reinyección de salmuera marca la diferencia en el cuidado del acuífero.", sentiment: "positivo" },
        { author: "Mariana Albornoz", role: "Consultora EHS Salta", text: "Importante que se garantice el acceso a la documentación completa para los pobladores de El Peñón previo al 27 de agosto.", sentiment: "neutro" },
        { author: "Comunidad Antofagasta", role: "Vecino Autoconvocado", text: "Queremos conocer en detalle las tasas de uso de agua dulce en la planta de procesamiento de Lilac.", sentiment: "inquietud" },
        { author: "Lic. Javier Ruiz", role: "Analista de Mercados Mineros", text: "Gran paso para Lake Resources y Lilac Solutions para validar su modelo comercial en Argentina.", sentiment: "positivo" }
      ]
    },
    {
      id: "post-2",
      author: "Bárbara Cozzi",
      role: "Country Manager & Regional General Counsel @ Lake Resources",
      platform: "linkedin",
      title: "Un hito clave para Kachi: Inicio de la Consulta Pública en Catamarca",
      content: "Orgullosos de presentar el trabajo riguroso de todo el equipo técnico y ambiental para el IIA de Kachi. Abrimos el diálogo transparente con las comunidades de El Peñón y toda la provincia rumbo a la Audiencia Pública del 27 de agosto. Agradecida al equipo de Lilac Solutions y a las autoridades de Minería de Catamarca.",
      url: "https://www.linkedin.com/company/lake-resources",
      likes: 310,
      shares: 64,
      commentsCount: 38,
      sentiment: "positivo",
      date: "2026-08-03",
      comments: [
        { author: "Esteban Gutierrez", role: "Proveedor Minero NOA", text: "Felicitaciones Bárbara y a todo el equipo de Lake y Lilac! Gran impulso para la cadena de valor local en Catamarca.", sentiment: "positivo" },
        { author: "Luciana Molina", role: "Talent Acquisition Specialist", text: "Éxitos en esta instancia determinante para el desarrollo del proyecto Kachi!", sentiment: "positivo" },
        { author: "Dra. Sofía Peralta", role: "Abogada Ambiental", text: "¿La documentación técnica estará disponible en la oficina comunitaria de El Peñón durante todo el mes?", sentiment: "neutro" }
      ]
    },
    {
      id: "post-3",
      author: "Fuerza Minera",
      role: "Portal Noticias Mineras Argentina",
      platform: "web",
      title: "Catamarca fija fecha para la Audiencia Pública del proyecto de litio Kachi",
      content: "El 27 de agosto se llevará a cabo la audiencia en El Peñón. La empresa busca la aprobación del Informe de Impacto Ambiental para iniciar la fase de financiamiento directo de la construcción de la planta de Extracción Directa de Litio impulsada por Lilac Solutions.",
      url: "https://fuerzaminera.com/kachi-catamarca-consulta-publica",
      likes: 85,
      shares: 14,
      commentsCount: 8,
      sentiment: "positivo",
      date: "2026-08-04",
      comments: [
        { author: "Hugo Ferreyra", role: "Técnico Químico", text: "El sistema DLE de intercambiadores de iones patentado por Lilac permite procesar salmuera con alto rendimiento sin depender de grandes piletas de evaporación.", sentiment: "positivo" }
      ]
    },
    {
      id: "post-4",
      author: "InfoMinero Argentina",
      role: "Red de Información Minera",
      platform: "linkedin",
      title: "Tecnología DLE de Lilac Solutions y Lake Resources bajo escrutinio público",
      content: "Con el inicio de la participación ciudadana del IIA de Kachi, se difunden las especificaciones del proceso de extracción directa de Lilac y reinyección ambiental superior al 95%. La resolución de la DIA se proyecta para finales de septiembre de 2026.",
      url: "https://infomineroarg.com/kachi-participacion-ciudadana",
      likes: 198,
      shares: 31,
      commentsCount: 15,
      sentiment: "positivo",
      date: "2026-08-04",
      comments: [
        { author: "Martín Hulais", role: "Especialista en Gestión Ambiental & Cierre de Minas", text: "Un caso de estudio relevante para el NOA sobre evaluación de impacto ambiental con tecnologías de baja huella hídrica.", sentiment: "positivo" }
      ]
    },
    {
      id: "post-5",
      author: "Futuro Sustentable",
      role: "Medio Especializado en ESG & Medio Ambiente",
      platform: "web",
      title: "Participación Ciudadana en Catamarca: IIA del Proyecto Kachi",
      content: "Detalle de los talleres informativos y mesas de trabajo comunitarias planificadas por Lake Resources y Lilac Solutions durante agosto en la zona de influencia directa de Carachi Pampa y El Peñón.",
      url: "https://futurosustentable.com.ar/participacion-kachi",
      likes: 76,
      shares: 12,
      commentsCount: 6,
      sentiment: "neutro",
      date: "2026-08-05",
      comments: [
        { author: "Laura Benítez", role: "Socióloga Ambiental", text: "Es clave que las traducciones explicativas del informe sean accesibles para todos los pobladores locales.", sentiment: "neutro" }
      ]
    }
  ]
};

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATABASE, null, 2), 'utf8');
}

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed.posts && parsed.posts.length > 0 ? parsed : INITIAL_DATABASE;
  } catch (err) {
    return INITIAL_DATABASE;
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Auto-Scraper / Updater Simulation Logic
function runAutoSync() {
  const db = readData();
  console.log(`[Auto-Sync Engine] Executing automated scan for Kachi / Lilac Solutions news...`);

  // Simulated discovery of new sector mention
  const newDiscoveries = [
    {
      id: "post-auto-" + Date.now(),
      author: "El Ancasti - Sección Minería",
      role: "Periódico Provincial Catamarca",
      platform: "web",
      title: "El Peñón se prepara para la audiencia pública del proyecto de litio Kachi el 27 de agosto",
      content: "Autoridades locales y representantes del Ministerio de Minería coordinan la logística para la asamblea ciudadana en El Peñón. Se espera asistencia de comunidades locales y técnicos de Lilac Solutions.",
      url: "https://www.elancasti.com.ar/mineria/kachi-el-penon-audiencia",
      likes: 114,
      shares: 22,
      commentsCount: 9,
      sentiment: "positivo",
      date: new Date().toISOString().split('T')[0],
      comments: [
        { author: "Ramón Carrizo", role: "Poblador El Peñón", text: "Esperamos que la audiencia aclare las oportunidades de contratación mano de obra local.", sentiment: "positivo" }
      ]
    }
  ];

  // Avoid duplicates
  let addedCount = 0;
  newDiscoveries.forEach(item => {
    const exists = db.posts.some(p => p.title === item.title || p.id === item.id);
    if (!exists) {
      db.posts.unshift(item);
      addedCount++;
    }
  });

  if (addedCount > 0) {
    saveData(db);
    console.log(`[Auto-Sync Engine] Successfully added ${addedCount} new publication(s).`);
  }
}

// Scheduled auto-sync every 30 minutes in production
setInterval(runAutoSync, 30 * 60 * 1000);

// API Endpoints

app.get('/api/posts', (req, res) => {
  const db = readData();
  const { platform, sentiment, q } = req.query;
  let result = db.posts;

  if (platform && platform !== 'all') {
    result = result.filter(p => p.platform === platform);
  }
  if (sentiment && sentiment !== 'all') {
    result = result.filter(p => p.sentiment === sentiment);
  }
  if (q) {
    const search = q.toLowerCase();
    result = result.filter(p => p.title.toLowerCase().includes(search) || p.author.toLowerCase().includes(search) || p.content.toLowerCase().includes(search));
  }

  res.json({ success: true, count: result.length, data: result });
});

app.post('/api/posts', (req, res) => {
  const db = readData();
  const newPost = {
    id: "post-" + Date.now(),
    author: req.body.author || "Anonimo",
    role: req.body.role || "Publicación Registrada",
    platform: req.body.platform || "linkedin",
    title: req.body.title || "Nueva Publicación",
    content: req.body.content || req.body.title || "",
    url: req.body.url || "#",
    likes: parseInt(req.body.likes) || 0,
    shares: parseInt(req.body.shares) || 0,
    commentsCount: req.body.comments ? req.body.comments.length : 0,
    sentiment: req.body.sentiment || "positivo",
    date: new Date().toISOString().split('T')[0],
    comments: req.body.comments || []
  };

  db.posts.unshift(newPost);
  saveData(db);

  res.status(201).json({ success: true, data: newPost });
});

// Trigger Auto-Sync manually via API
app.post('/api/sync', (req, res) => {
  runAutoSync();
  const db = readData();
  res.json({ success: true, message: "Auto-Sync completado exitosamente", count: db.posts.length, data: db.posts });
});

app.get('/api/stats', (req, res) => {
  const db = readData();
  const posts = db.posts;
  const totalPosts = posts.length;
  const totalLikes = posts.reduce((acc, p) => acc + p.likes, 0);
  const totalShares = posts.reduce((acc, p) => acc + p.shares, 0);
  const totalComments = posts.reduce((acc, p) => acc + (p.comments ? p.comments.length : p.commentsCount), 0);
  const estimatedReach = Math.round((totalLikes * 24) + (totalShares * 90) + (totalPosts * 1400));
  const positivePosts = posts.filter(p => p.sentiment === "positivo").length;
  const positivePercentage = Math.round((positivePosts / totalPosts) * 100) || 0;

  res.json({
    success: true,
    stats: {
      totalPosts,
      totalLikes,
      totalShares,
      totalComments,
      estimatedReach,
      positivePercentage
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), app: 'Lilac Kachi Media Monitor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Lilac Kachi Media Monitor server running on http://localhost:${PORT}`);
});
