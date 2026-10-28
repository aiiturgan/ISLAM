
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const isDark = ref(true)
const search = ref('')
const now = ref(new Date())
const selectedBackground = ref('auto')

const timeOfDay = computed(() => {
  const hour = now.value.getHours()
  if (hour >= 5 && hour < 9) return 'dawn'
  if (hour >= 9 && hour < 17) return 'day'
  if (hour >= 17 && hour < 20) return 'sunset'
  return 'night'
})

const scenes = {
  dawn: {
    title: 'Рассвет',
    greeting: 'Пусть твой день начнётся с полезного знания',
    icon: '☀',
    image:
      'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1800&q=85',
  },
  day: {
    title: 'День',
    greeting: 'Каждый день — возможность узнать что-то новое',
    icon: '☼',
    image:
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1800&q=85',
  },
  sunset: {
    title: 'Закат',
    greeting: 'Найди немного времени для знаний и спокойствия',
    icon: '☀',
    image:
      'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1800&q=85',
  },
  night: {
    title: 'Ночь',
    greeting: 'Заверши день с благодарностью и добрым намерением',
    icon: '☾',
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=85',
  },
}

const currentScene = computed(() => {
  if (selectedBackground.value !== 'auto') {
    return scenes[selectedBackground.value as keyof typeof scenes]
  }
  return scenes[timeOfDay.value]
})

const backgroundStyle = computed(() => ({
  backgroundImage: `linear-gradient(90deg, rgba(8, 32, 24, .91), rgba(8, 32, 24, .48), rgba(8, 32, 24, .12)), url("${currentScene.value.image}")`,
}))

const navItems = [
  { icon: '⌂', label: 'Главная' },
  { icon: '▤', label: 'Обучение' },
  { icon: '☪', label: 'Намаз' },
  { icon: '▧', label: 'Коран' },
  { icon: '♡', label: 'Дуа и азкары' },
  { icon: '◷', label: 'Календарь' },
  { icon: '✿', label: 'Библиотека' },
  { icon: '✧', label: 'ИИ-помощник' },
]

const activeNav = ref('Главная')
const router = useRouter()

function openNav(label: string) {
  activeNav.value = label

  if (label === 'Обучение') {
    router.push('/learning')
  }
}

const quickLinks = [
  { icon: '☪', title: 'Намаз', subtitle: 'Учимся молиться', color: 'sage' },
  { icon: '▤', title: 'Коран', subtitle: 'Читать и изучать', color: 'rose' },
  { icon: '♡', title: 'Дуа и азкары', subtitle: 'На каждый день', color: 'gold' },
  { icon: '✧', title: 'Обучение', subtitle: 'Продолжить урок', color: 'lavender' },
]

const lessons = [
  { number: '01', title: 'Что такое ислам?', category: 'Основы ислама', progress: 0 },
  { number: '02', title: 'Что такое иман?', category: 'Основы веры', progress: 0 },
  { number: '03', title: 'Как совершать вуду?', category: 'Практика', progress: 0 },
  { number: '04', title: 'Знакомство с Кораном', category: 'Коран', progress: 0 },
]

const filteredLessons = computed(() => {
  const query = search.value.trim().toLocaleLowerCase('ru')
  if (!query) return lessons
  return lessons.filter((lesson) =>
    `${lesson.title} ${lesson.category}`.toLocaleLowerCase('ru').includes(query),
  )
})

let clockTimer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  clockTimer = setInterval(() => {
    now.value = new Date()
  }, 60_000)
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
})

function toggleTheme() {
  isDark.value = !isDark.value
}

function chooseBackground(value: string) {
  selectedBackground.value = value
  localStorage.setItem('nur-background', value)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('nur-theme')
  const savedBackground = localStorage.getItem('nur-background')
  if (savedTheme) isDark.value = savedTheme === 'dark'
  if (savedBackground) selectedBackground.value = savedBackground
})

function saveTheme() {
  localStorage.setItem('nur-theme', isDark.value ? 'dark' : 'light')
}
</script>

<template>
  <div class="app-shell" :class="isDark ? 'theme-dark' : 'theme-light'">
    <aside class="sidebar">
      <a class="brand" href="#" @click.prevent="activeNav = 'Главная'">
        <span class="brand-mark">ن</span>
        <span>
          <strong>Nur</strong>
          <small>Путь к знанию</small>
        </span>
      </a>

      <div class="sidebar-label">МЕНЮ</div>
      <nav class="side-nav">
        <button
          v-for="item in navItems"
          :key="item.label"
          class="nav-item"
          :class="{ active: activeNav === item.label }"
          @click="openNav(item.label)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="sidebar-bottom">
        <div class="profile-mini">
          <div class="avatar">أ</div>
          <div>
            <strong>Мой путь</strong>
            <small>Твоё пространство знаний</small>
          </div>
        </div>
        <p>Учись постепенно. Каждый шаг имеет значение.</p>
      </div>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <div class="breadcrumb">Nur <span>/</span> {{ activeNav }}</div>
        <div class="top-actions">
          <label class="search-box">
            <span>⌕</span>
            <input
              v-model="search"
              type="search"
              placeholder="Поиск уроков, дуа, терминов..."
              aria-label="Поиск по материалам"
            />
            <kbd>⌘ K</kbd>
          </label>
          <button
            class="theme-toggle"
            :aria-label="isDark ? 'Включить светлую тему' : 'Включить тёмную тему'"
            @click="toggleTheme(); saveTheme()"
          >
            {{ isDark ? '☼' : '☾' }}
          </button>
          <button class="profile-button" aria-label="Профиль">أ</button>
        </div>
      </header>

      <section class="hero" :style="backgroundStyle">
        <div class="hero-content">
          <div class="eyebrow"><span></span> ТВОЁ ПРОСТРАНСТВО ЗНАНИЙ</div>
          <p class="arabic-greeting">السَّلَامُ عَلَيْكُمْ</p>
          <h1>Ассаляму алейкум!</h1>
          <p class="hero-description">{{ currentScene.greeting }}</p>
          <p class="hero-subtitle">
            Не нужно знать всё сразу. Двигайся в своём темпе и открывай новое.
          </p>
          <button class="primary-button" @click="activeNav = 'Обучение'">
            Продолжить обучение <span>↗</span>
          </button>
        </div>

        <div class="hero-footer">
          <span class="scene-label">{{ currentScene.icon }} {{ currentScene.title }}</span>
          <label class="background-select">
            <span>Фон</span>
            <select
              :value="selectedBackground"
              aria-label="Выбрать фон главной страницы"
              @change="chooseBackground(($event.target as HTMLSelectElement).value)"
            >
              <option value="auto">По времени суток</option>
              <option value="dawn">Рассвет</option>
              <option value="day">День</option>
              <option value="sunset">Закат</option>
              <option value="night">Ночь</option>
            </select>
          </label>
        </div>
      </section>

      <section class="quick-grid">
        <button
          v-for="link in quickLinks"
          :key="link.title"
          class="quick-card"
          @click="activeNav = link.title === 'Дуа и азкары' ? link.title : link.title"
        >
          <span class="quick-icon" :class="link.color">{{ link.icon }}</span>
          <span class="quick-text">
            <strong>{{ link.title }}</strong>
            <small>{{ link.subtitle }}</small>
          </span>
          <span class="card-arrow">↗</span>
        </button>
      </section>

      <section class="prayer-progress-grid">
        <article class="panel prayer-panel">
          <div class="section-heading">
            <div>
              <span class="section-kicker">ЕЖЕДНЕВНАЯ ПРАКТИКА</span>
              <h2>Время намаза</h2>
            </div>
            <span class="city-pill">⌖ Бишкек</span>
          </div>
          <p class="panel-note">Пример расписания · подключим реальные данные позже</p>
          <div class="prayer-times">
            <div class="prayer-time">
              <span>☀</span><small>Фаджр</small><strong>05:12</strong>
            </div>
            <div class="prayer-time">
              <span>◉</span><small>Зухр</small><strong>12:41</strong>
            </div>
            <div class="prayer-time">
              <span>☼</span><small>Аср</small><strong>16:17</strong>
            </div>
            <div class="prayer-time">
              <span>◒</span><small>Магриб</small><strong>19:23</strong>
            </div>
            <div class="prayer-time">
              <span>☾</span><small>Иша</small><strong>20:52</strong>
            </div>
          </div>
          <p class="prayer-disclaimer">
            Время пока демонстрационное, не используй его как точное расписание.
          </p>
        </article>

        <article class="panel progress-panel">
          <div class="section-heading">
            <div>
              <span class="section-kicker">ТВОЙ ПУТЬ</span>
              <h2>Мой прогресс</h2>
            </div>
            <span class="progress-emblem">✧</span>
          </div>
          <div class="progress-row">
            <div class="progress-symbol">▤</div>
            <div class="progress-copy">
              <strong>Основы ислама</strong>
              <small>Начни с первого урока</small>
            </div>
            <strong class="progress-percent">0%</strong>
          </div>
          <div class="progress-track"><span></span></div>
          <p class="panel-note">Прогресс будет сохраняться после подключения базы данных.</p>
        </article>
      </section>

      <section class="lessons-section">
        <div class="section-heading lessons-heading">
          <div>
            <span class="section-kicker">ЗНАНИЯ ПОСТЕПЕННО</span>
            <h2>{{ search ? 'Результаты поиска' : 'Начни свой путь' }}</h2>
          </div>
          <button class="text-button" @click="activeNav = 'Обучение'">
            Все уроки <span>→</span>
          </button>
        </div>

        <div v-if="filteredLessons.length" class="lesson-grid">
          <button
            v-for="lesson in filteredLessons"
            :key="lesson.number"
            class="lesson-card"
            @click="activeNav = 'Обучение'"
          >
            <div class="lesson-art" :class="`art-${lesson.number}`">
              <span class="lesson-number">{{ lesson.number }}</span>
              <span class="lesson-art-symbol">
                {{ lesson.number === '01' ? '☪' : lesson.number === '02' ? '✧' : lesson.number === '03' ? '❋' : '▤' }}
              </span>
            </div>
            <div class="lesson-info">
              <small>{{ lesson.category }}</small>
              <strong>{{ lesson.title }}</strong>
              <span class="lesson-link">Открыть урок <span>↗</span></span>
            </div>
          </button>
        </div>
        <div v-else class="empty-state">
          <span>⌕</span>
          <strong>Ничего не найдено</strong>
          <p>Попробуй другое слово или название темы.</p>
        </div>
      </section>

      <footer class="footer">
        <span class="footer-mark">ن</span>
        <span>Учись постепенно, с искренним намерением.</span>
        <span class="footer-note">Nur · Пространство знаний</span>
      </footer>
    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

:root {
  font-family: 'DM Sans', sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-optical-sizing: auto;
  font-weight: 400;
  color-scheme: dark;
  background: #0c2019;
  font-size: 14px;
}

* { box-sizing: border-box; }
body { margin: 0; min-width: 320px; min-height: 100vh; }
button, input, select { font: inherit; }
button { cursor: pointer; }
button:focus-visible, input:focus-visible, select:focus-visible {
  outline: 2px solid #d9b66d;
  outline-offset: 3px;
}
.app-shell {
  --bg: #0d2119;
  --sidebar: #0a1b15;
  --panel: #142b21;
  --panel-soft: #193528;
  --text: #f5f0e5;
  --muted: #b4c0b5;
  --border: rgba(222, 204, 157, .14);
  --gold: #d8b66c;
  --gold-light: #f0d89d;
  --accent: #c5d9b8;
  --rose: #d7a5ac;
  --shadow: 0 16px 42px rgba(0,0,0,.12);
  min-height: 100vh;
  display: grid;
  grid-template-columns: 248px minmax(0, 1fr);
  background: var(--bg);
  color: var(--text);
  transition: background .35s, color .35s;
}
.theme-light {
  --bg: #f7f2e9;
  --sidebar: #f0e9dc;
  --panel: rgba(255, 253, 247, .86);
  --panel-soft: #f4e9e1;
  --text: #294637;
  --muted: #778579;
  --border: rgba(67, 94, 69, .13);
  --gold: #a9854b;
  --gold-light: #c6a66b;
  --accent: #dce9d7;
  --rose: #d5a0ac;
  --shadow: 0 12px 32px rgba(82, 71, 49, .06);
  color-scheme: light;
}
.sidebar {
  background: var(--sidebar);
  border-right: 1px solid var(--border);
  min-height: 100vh;
  padding: 28px 16px 20px;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}
.brand { display: flex; align-items: center; gap: 12px; padding: 0 10px 30px; text-decoration: none; color: inherit; }
.brand-mark, .footer-mark {
  font-family: 'Amiri', serif;
  color: var(--gold);
  font-size: 38px;
  line-height: 1;
  width: 42px;
  height: 48px;
  display: grid;
  place-items: center;
  border: 1px solid var(--gold);
  border-radius: 22px 22px 9px 9px;
}
.brand strong { display: block; font: 800 26px 'Manrope', sans-serif; letter-spacing: -.9px; }
.brand small { display: block; color: var(--muted); font-size: 11px; margin-top: 2px; }
.sidebar-label, .section-kicker { font-size: 9px; font-weight: 800; letter-spacing: 1.6px; color: var(--muted); }
.sidebar-label { padding: 0 12px 12px; }
.side-nav { display: grid; gap: 5px; }
.nav-item {
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  gap: 13px;
  width: 100%;
  min-height: 44px;
  padding: 0 12px;
  color: var(--muted);
  background: transparent;
  border-radius: 12px;
  text-align: left;
  transition: .2s;
}
.nav-item:hover { background: var(--panel-soft); color: var(--text); }
.nav-item.active {
  color: var(--text);
  background: linear-gradient(100deg, rgba(201, 177, 112, .22), rgba(185, 214, 179, .12));
  border-color: rgba(216,182,108,.34);
  box-shadow: inset 3px 0 var(--gold);
}
.nav-icon { width: 23px; text-align: center; color: var(--gold); font-size: 19px; }
.sidebar-bottom { margin-top: auto; }
.profile-mini { display: flex; align-items: center; gap: 10px; padding: 12px; border: 1px solid var(--border); border-radius: 14px; }
.avatar, .profile-button { display: grid; place-items: center; border-radius: 50%; background: var(--panel-soft); color: var(--gold); font-family: 'Amiri', serif; font-size: 22px; }
.avatar { width: 38px; height: 38px; }
.profile-mini strong, .profile-mini small { display: block; }
.profile-mini strong { font-size: 12px; }
.profile-mini small { font-size: 10px; color: var(--muted); margin-top: 3px; }
.sidebar-bottom p { margin: 13px 8px 0; color: var(--muted); font-size: 11px; line-height: 1.7; }
.main-content { min-width: 0; padding: 0 34px 20px; max-width: 1600px; width: 100%; margin: 0 auto; }
.topbar { min-height: 78px; display: flex; justify-content: space-between; align-items: center; gap: 18px; }
.breadcrumb { color: var(--muted); font-size: 12px; }
.breadcrumb span { margin: 0 8px; color: var(--gold); }
.top-actions { display: flex; align-items: center; gap: 10px; }
.search-box { display: flex; align-items: center; gap: 9px; width: min(400px, 40vw); height: 42px; padding: 0 12px; border: 1px solid var(--border); background: var(--panel); border-radius: 13px; color: var(--muted); }
.search-box > span { font-size: 22px; }
.search-box input { border: 0; outline: none; background: transparent; color: var(--text); width: 100%; min-width: 0; font-size: 11px; }
.search-box input::placeholder { color: var(--muted); }
kbd { font-size: 9px; padding: 3px 5px; border: 1px solid var(--border); border-radius: 5px; white-space: nowrap; }
.theme-toggle, .profile-button { width: 40px; height: 40px; border: 1px solid var(--border); border-radius: 13px; background: var(--panel); color: var(--gold); font-size: 22px; }
.profile-button { border-radius: 50%; }
.hero {
  min-height: 300px;
  border-radius: 22px;
  background-color: #1a382a;
  background-position: center;
  background-size: cover;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 35px 40px 62px;
  box-shadow: var(--shadow);
  isolation: isolate;
  transition: background-image .4s;
}
.theme-light .hero {
  background-image: linear-gradient(90deg, rgba(34,58,43,.84), rgba(34,58,43,.35), rgba(34,58,43,.06)), url('https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1800&q=85') !important;
}
.hero-content { max-width: 580px; color: #fffaf0; position: relative; z-index: 1; }
.eyebrow { display: flex; align-items: center; gap: 8px; color: #ead6a4; font-size: 9px; font-weight: 700; letter-spacing: 1.8px; }
.eyebrow span { width: 18px; height: 1px; background: var(--gold); }
.arabic-greeting { font: 30px 'Amiri', serif; margin: 22px 0 5px; color: #f5dfaa; }
.hero h1 { font: 800 clamp(27px, 3vw, 42px)/1.15 'Manrope', sans-serif; letter-spacing: -1.4px; margin: 0; }
.hero-description { font-size: 15px; line-height: 1.6; margin: 13px 0 5px; }
.hero-subtitle { font-size: 12px; line-height: 1.8; color: rgba(255,250,240,.77); max-width: 420px; margin: 0 0 20px; }
.primary-button { background: linear-gradient(135deg, #e8ce8b, #c7a15b); color: #213a2a; border: 0; padding: 12px 17px; border-radius: 10px; font-size: 12px; font-weight: 800; display: inline-flex; gap: 16px; align-items: center; box-shadow: 0 7px 22px rgba(0,0,0,.12); }
.primary-button:hover { filter: brightness(1.07); transform: translateY(-1px); }
.hero-footer { position: absolute; z-index: 2; bottom: 14px; left: 24px; right: 24px; display: flex; justify-content: space-between; align-items: center; gap: 12px; color: white; }
.scene-label { font-size: 11px; color: #fff5db; text-shadow: 0 1px 8px #000; }
.background-select { display: flex; align-items: center; gap: 7px; font-size: 10px; }
.background-select select { max-width: 155px; border: 1px solid rgba(255,255,255,.32); border-radius: 8px; padding: 7px 9px; background: rgba(10,31,22,.7); color: white; font-size: 10px; }
.quick-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin: 20px 0; }
.quick-card { display: flex; align-items: center; text-align: left; gap: 11px; min-width: 0; padding: 15px 13px; border: 1px solid var(--border); border-radius: 15px; background: var(--panel); color: var(--text); box-shadow: var(--shadow); transition: .2s; }
.quick-card:hover { transform: translateY(-2px); border-color: var(--gold); }
.quick-icon { flex: 0 0 42px; width: 42px; height: 42px; display: grid; place-items: center; border-radius: 13px; font-size: 21px; }
.quick-icon.sage { background: #dce9d5; color: #2f654a; }
.quick-icon.rose { background: #f2dfe2; color: #8d5362; }
.quick-icon.gold { background: #f3e8cb; color: #88662f; }
.quick-icon.lavender { background: #e9e1f1; color: #665080; }
.theme-dark .quick-icon.sage { background: #294c39; color: #d0e1c6; }
.theme-dark .quick-icon.rose { background: #4a3039; color: #edc4ce; }
.theme-dark .quick-icon.gold { background: #493e29; color: #f0d89d; }
.theme-dark .quick-icon.lavender { background: #393047; color: #ded0f1; }
.quick-text { display: grid; gap: 5px; min-width: 0; }
.quick-text strong { font-size: 12px; }
.quick-text small { color: var(--muted); font-size: 10px; }
.card-arrow { margin-left: auto; color: var(--gold); align-self: flex-start; }
.prayer-progress-grid { display: grid; grid-template-columns: 1.35fr 1fr; gap: 14px; }
.panel { border: 1px solid var(--border); background: var(--panel); border-radius: 17px; padding: 20px; box-shadow: var(--shadow); min-width: 0; }
.section-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.section-heading h2 { font: 700 19px 'Manrope', sans-serif; letter-spacing: -.5px; margin: 6px 0 0; }
.section-kicker { font-size: 8px; }
.city-pill { font-size: 10px; padding: 7px 10px; border-radius: 20px; color: var(--muted); border: 1px solid var(--border); }
.panel-note { font-size: 10px; line-height: 1.6; color: var(--muted); margin: 11px 0 15px; }
.prayer-times { display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap: 7px; }
.prayer-time { display: grid; justify-items: center; gap: 6px; padding: 11px 3px; border: 1px solid var(--border); border-radius: 10px; }
.prayer-time:first-child { background: rgba(201, 177, 112, .12); border-color: rgba(201,177,112,.28); }
.prayer-time span { color: var(--gold); font-size: 17px; }
.prayer-time small { color: var(--muted); font-size: 9px; }
.prayer-time strong { font-size: 12px; }
.prayer-disclaimer { color: var(--muted); font-size: 9px; line-height: 1.5; margin: 12px 0 0; }
.progress-emblem { font-size: 25px; color: var(--gold); }
.progress-row { display: flex; align-items: center; gap: 11px; margin-top: 26px; }
.progress-symbol { display: grid; place-items: center; width: 43px; height: 43px; border-radius: 13px; color: var(--gold); background: var(--panel-soft); font-size: 22px; }
.progress-copy { display: grid; gap: 5px; flex: 1; }
.progress-copy strong { font-size: 12px; }
.progress-copy small { font-size: 10px; color: var(--muted); }
.progress-percent { color: var(--gold); font-size: 12px; }
.progress-track { height: 6px; background: var(--panel-soft); border-radius: 20px; margin: 18px 0 0; overflow: hidden; }
.progress-track span { display: block; height: 100%; width: 0; background: var(--gold); border-radius: inherit; }
.lessons-section { margin-top: 30px; }
.lessons-heading { margin-bottom: 16px; }
.text-button { border: 0; background: transparent; color: var(--gold); font-size: 11px; font-weight: 700; padding: 8px 0 8px 8px; }
.text-button span { margin-left: 6px; }
.lesson-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 13px; }
.lesson-card { overflow: hidden; padding: 0; text-align: left; border: 1px solid var(--border); border-radius: 15px; background: var(--panel); color: var(--text); transition: .2s; }
.lesson-card:hover { transform: translateY(-3px); border-color: var(--gold); }
.lesson-art { height: 125px; position: relative; display: grid; place-items: center; overflow: hidden; background: linear-gradient(135deg,#284b39,#10291f); }
.lesson-art::before, .lesson-art::after { content: ''; position: absolute; border: 1px solid rgba(235,213,159,.45); border-radius: 100px 100px 0 0; width: 105px; height: 135px; bottom: -54px; }
.lesson-art::after { width: 145px; height: 175px; bottom: -90px; border-color: rgba(235,213,159,.23); }
.art-02 { background: linear-gradient(135deg,#a67c7e,#f0d7ce); }
.art-03 { background: linear-gradient(135deg,#b3c6ad,#415b47); }
.art-04 { background: linear-gradient(135deg,#c3a46e,#58482f); }
.lesson-number { position: absolute; top: 11px; left: 12px; font-size: 10px; color: rgba(255,255,255,.75); }
.lesson-art-symbol { position: relative; z-index: 1; color: #f3dca3; font-size: 44px; text-shadow: 0 4px 20px #0003; }
.art-02 .lesson-art-symbol { color: #fff1ed; }
.art-03 .lesson-art-symbol { color: #e4ead9; }
.lesson-info { display: grid; gap: 8px; padding: 14px; }
.lesson-info small { color: var(--muted); font-size: 9px; }
.lesson-info strong { font-size: 12px; line-height: 1.5; min-height: 36px; }
.lesson-link { display: flex; justify-content: space-between; align-items: center; color: var(--gold); font-size: 10px; padding-top: 8px; border-top: 1px solid var(--border); }
.empty-state { text-align: center; padding: 45px 15px; color: var(--muted); }
.empty-state > span { font-size: 30px; }
.empty-state strong { display: block; color: var(--text); margin-top: 12px; }
.empty-state p { font-size: 12px; }
.footer { display: flex; align-items: center; gap: 12px; border-top: 1px solid var(--border); margin-top: 35px; padding: 20px 0 8px; color: var(--muted); font-size: 10px; }
.footer-mark { width: 26px; height: 30px; font-size: 20px; border-radius: 15px 15px 6px 6px; }
.footer-note { margin-left: auto; }
.theme-light .hero { box-shadow: 0 14px 38px rgba(74,64,46,.1); }

@media (max-width: 1100px) {
  .app-shell { grid-template-columns: 205px minmax(0,1fr); }
  .main-content { padding: 0 22px 20px; }
  .quick-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .lesson-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
}
@media (max-width: 700px) {
  .app-shell { display: block; padding-bottom: 72px; }
  .sidebar { display: none; }
  .main-content { padding: 0 15px 20px; }
  .topbar { min-height: 65px; }
  .breadcrumb { display: none; }
  .top-actions { width: 100%; gap: 7px; }
  .search-box { flex: 1; width: auto; }
  kbd { display: none; }
  .hero { min-height: 335px; padding: 27px 22px 64px; border-radius: 18px; background-position: center; }
  .arabic-greeting { font-size: 25px; margin-top: 18px; }
  .hero h1 { font-size: 29px; }
  .hero-description { font-size: 13px; }
  .hero-subtitle { font-size: 11px; }
  .hero-footer { left: 15px; right: 15px; }
  .background-select { gap: 4px; }
  .background-select select { max-width: 130px; }
  .quick-grid { gap: 9px; margin: 14px 0; }
  .quick-card { padding: 12px 9px; gap: 8px; }
  .quick-icon { width: 35px; height: 35px; flex-basis: 35px; font-size: 18px; }
  .quick-text strong { font-size: 11px; }
  .quick-text small { font-size: 9px; }
  .card-arrow { display: none; }
  .prayer-progress-grid { grid-template-columns: 1fr; }
  .panel { padding: 16px; }
  .prayer-times { gap: 4px; }
  .prayer-time small { font-size: 8px; }
  .prayer-time strong { font-size: 10px; }
  .lesson-grid { gap: 9px; }
  .lesson-art { height: 105px; }
  .lesson-info { padding: 11px; }
  .lesson-info strong { font-size: 11px; }
  .footer { flex-wrap: wrap; }
  .footer-note { width: 100%; margin-left: 38px; }
}
</style>
