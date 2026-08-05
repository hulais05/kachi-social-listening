# 🟣 Lilac Solutions - Kachi Social Listening Hub

**Proyecto:** Proyecto de Litio Kachi (Lake Resources & Lilac Solutions)  
**Evento Clave:** Consulta Pública e IIA - Audiencia Pública del 27 de Agosto de 2026 en El Peñón, Catamarca.  
**Repositorio GitHub:** `https://github.com/hulais05/kachi-social-listening`  
**Estado de Monitoreo:** En Vivo (Docker + Express REST API + Live Dashboard)

---

## 📌 Resumen Ejecutivo

Plataforma de inteligencia de medios y monitoreo en vivo diseñada exclusivamente para rastrear y centralizar las publicaciones, interacciones (likes, compartidos), comentarios y clima de opinión pública vinculados a la consulta pública del IIA del proyecto Kachi en Catamarca.

---

## 🛠️ Arquitectura Full-Stack

* **Backend:** Node.js + Express REST API (`/api/posts`, `/api/stats`).
* **Base de Datos:** Persistencia en `data/database.json` con volúmenes montados en Docker.
* **Frontend:** Dashboard SPA con diseño corporativo oficial de Lilac Solutions (`#C598FE`), Chart.js para analítica de tendencias y modal de inspección de comentarios.
* **Contenerización:** Dockerfile + docker-compose (`docker-compose up -d`).

---

## 🔒 Auditoría de Seguridad & Privacidad

- [x] `.gitignore` configurado para evitar la fuga de secretos, claves `.env` y archivos temporales.
- [x] `.env.example` creado para la gestión de variables de entorno.
- [x] Repositorio limpio y listo para publicación segura en GitHub.

---

## 🚀 Comandos de Despliegue

```bash
# Iniciar servidor local
npm start

# Desplegar con Docker
docker-compose up -d --build
```
