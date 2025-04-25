# 🐾 frad-in — Personal Playground of Thomas Fradin de Bellabre

> A modern, modular, and playful dev space to showcase my experiments, side projects, and tech oddities.  
> Live at [https://bellab.re](https://bellab.re)

[![Website Status](https://img.shields.io/website?url=https%3A%2F%2Fbellab.re)](https://bellab.re)  
[![Made with Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)  
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)  
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)  
[![MIT License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## 🚀 What is `frad-in`?

This is my digital garage.  
A personal playground where I publish weird, smart, and fun stuff I build with modern web tools. Hosted on [bellab.re](https://bellab.re), this space is intentionally:

- 🔥 Fast (Next.js + Vercel)
- 🧠 Creative (AI, APIs, maps, games)
- 📱 Mobile-friendly
- ✨ Full of easter eggs (👋 Damien)

---

## 🧪 Featured Projects

- 🎲 **Bendo na Bendo (B2B)**  
  Mini-game to guess if a French rap punchline is real or AI-generated. Uses Supabase for real punchlines and OpenAI API for fakes.

- 🍽 **Restaurant Radar**  
  A Google Maps-based radar for nearby restaurants with filters, cuisine types, ratings and info popups. Built with the Places API.

- 📚 **Talaref**  
  A fun meme encyclopedia of French YouTube culture and "tala refs", backed by Supabase. Supports images, embeds, text, and tweet display.

- 🧼 **Sanity Checker**  
  Just because I needed a space to validate funny data, logic, or JSON things — manually or by script.

---

## 🛠️ Tech Stack

| Tech        | Used For                          |
|-------------|-----------------------------------|
| **Next.js** | App structure, SSR, routing       |
| **Tailwind CSS** | Fast styling, responsive design |
| **Vercel**  | Hosting, auto-deploy from GitHub  |
| **Supabase** | Database + auth + serverless APIs |
| **OpenAI**  | AI punchline generation (GPT-3.5) |
| **Google Maps / Places API** | Restaurant Radar |
| **react-tweet** | Rendering tweets cleanly       |

---

## 🔌 APIs Used

- ✅ `Supabase RPCs` for random punchline selection
- 🔁 `OpenAI Chat Completion API` to generate French rap bars
- 🍜 `Google Maps JavaScript SDK` & `Places API` for geolocation + restaurant info
- 🐦 `react-tweet` to embed Twitter/X posts

---

## 📦 Setup Locally

Clone this repo and start developing:

```bash
git clone https://github.com/Zakran27/frad-in.git
cd frad-in
npm install
npm run dev
