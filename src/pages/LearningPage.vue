
<script setup lang="ts">
import { computed, ref } from 'vue'

const search = ref('')
const selectedLevel = ref('Все уровни')

const levels = ['Все уровни', 'Я начинаю', 'Я практикую', 'Изучаю глубже']

const courses = [
  {
    title: 'Основы ислама',
    description: 'Познакомься с исламом, его основами и главными понятиями.',
    level: 'Я начинаю',
    lessons: 8,
    icon: '✧',
    color: 'green',
  },
  {
    title: 'Основы веры — иман',
    description: 'Изучи основы веры понятным языком, шаг за шагом.',
    level: 'Я начинаю',
    lessons: 6,
    icon: '☾',
    color: 'rose',
  },
  {
    title: 'Омовение и чистота',
    description: 'Вуду, гусль и другие правила очищения по ханафитскому мазхабу.',
    level: 'Я практикую',
    lessons: 10,
    icon: '❋',
    color: 'sage',
  },
  {
    title: 'Как совершать намаз',
    description: 'Подготовка, движения, чтения и порядок молитвы.',
    level: 'Я практикую',
    lessons: 12,
    icon: '⌁',
    color: 'gold',
  },
  {
    title: 'Знакомство с Кораном',
    description: 'Суры, аяты, структура Корана и основы чтения.',
    level: 'Я начинаю',
    lessons: 7,
    icon: '▤',
    color: 'lavender',
  },
  {
    title: 'Введение в фикх',
    description: 'Что такое фикх, мазхабы и как формируются практические постановления.',
    level: 'Изучаю глубже',
    lessons: 9,
    icon: '◇',
    color: 'green',
  },
]

const filteredCourses = computed(() => {
  const query = search.value.trim().toLocaleLowerCase('ru')
  return courses.filter((course) => {
    const matchesLevel =
      selectedLevel.value === 'Все уровни' || course.level === selectedLevel.value
    const matchesSearch =
      !query ||
      `${course.title} ${course.description} ${course.level}`
        .toLocaleLowerCase('ru')
        .includes(query)

    return matchesLevel && matchesSearch
  })
})
</script>

<template>
  <div class="learning-page">
    <header class="learning-heading">
      <div>
        <p class="eyebrow">ТВОЙ ПУТЬ К ЗНАНИЮ</p>
        <h1>Обучение</h1>
        <p class="intro">
          Начинай с того, что знаешь сегодня. Новые знания открывай постепенно.
        </p>
      </div>
      <div class="heading-decoration">✧</div>
    </header>

    <section class="welcome-card">
      <div class="welcome-icon">ن</div>
      <div>
        <p class="welcome-label">НЕ НУЖНО ЗНАТЬ ВСЁ СРАЗУ</p>
        <h2>Каждый урок — ещё один шаг</h2>
        <p>Выбирай подходящий маршрут и учись в своём темпе.</p>
      </div>
    </section>

    <section class="course-controls">
      <label class="course-search">
        <span>⌕</span>
        <input v-model="search" type="search" placeholder="Найти урок или тему..." />
      </label>

      <div class="level-filters">
        <button
          v-for="level in levels"
          :key="level"
          :class="{ selected: selectedLevel === level }"
          @click="selectedLevel = level"
        >
          {{ level }}
        </button>
      </div>
    </section>

    <section class="course-section">
      <div class="section-title">
        <div>
          <p class="eyebrow">ОБУЧАЙСЯ ПОШАГОВО</p>
          <h2>Учебные маршруты</h2>
        </div>
        <span class="course-count">{{ filteredCourses.length }} курса</span>
      </div>

      <div v-if="filteredCourses.length" class="course-grid">
        <article
          v-for="course in filteredCourses"
          :key="course.title"
          class="course-card"
        >
          <div class="course-art" :class="`art-${course.color}`">
            <span class="art-ornament">✧</span>
            <span class="art-icon">{{ course.icon }}</span>
            <span class="art-label">{{ course.level }}</span>
          </div>

          <div class="course-content">
            <h3>{{ course.title }}</h3>
            <p>{{ course.description }}</p>

            <div class="course-meta">
              <span>▤ {{ course.lessons }} уроков</span>
              <span>Начать ↗</span>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="empty-results">
        <span>⌕</span>
        <h3>Ничего не найдено</h3>
        <p>Попробуй другое название или выбери другой уровень.</p>
      </div>
    </section>

    <aside class="source-note">
      <span>✧</span>
      <p>
        Религиозные материалы будут сопровождаться источниками и проверяться
        перед публикацией. Сейчас здесь показаны примеры учебных карточек.
      </p>
    </aside>
  </div>
</template>

<style scoped>
.learning-page {
  color: var(--text);
  padding: 28px 0 40px;
}
.learning-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 25px;
}
.eyebrow {
  color: var(--gold);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.7px;
  margin: 0 0 9px;
}
.learning-heading h1 {
  font: 800 clamp(30px, 4vw, 43px) 'Manrope', sans-serif;
  letter-spacing: -1.4px;
  margin: 0;
}
.intro {
  color: var(--muted);
  line-height: 1.7;
  font-size: 13px;
  max-width: 550px;
  margin: 12px 0 0;
}
.heading-decoration {
  color: var(--gold);
  font-size: 64px;
  opacity: .7;
  padding-right: 22px;
}
.welcome-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: linear-gradient(120deg, var(--panel-soft), var(--panel));
  margin-bottom: 27px;
}
.welcome-icon {
  display: grid;
  place-items: center;
  flex: 0 0 62px;
  width: 62px;
  height: 70px;
  border: 1px solid var(--gold);
  border-radius: 32px 32px 12px 12px;
  color: var(--gold);
  font: 36px 'Amiri', serif;
}
.welcome-label {
  color: var(--gold);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.2px;
  margin: 0 0 8px;
}
.welcome-card h2 {
  font: 700 19px 'Manrope', sans-serif;
  margin: 0 0 7px;
}
.welcome-card p:last-child {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.7;
  margin: 0;
}
.course-controls {
  display: grid;
  gap: 14px;
  margin-bottom: 30px;
}
.course-search {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 46px;
  padding: 0 15px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--panel);
  color: var(--muted);
}
.course-search > span { font-size: 23px; }
.course-search input {
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text);
  width: 100%;
  font-size: 12px;
}
.course-search input::placeholder { color: var(--muted); }
.level-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.level-filters button {
  border: 1px solid var(--border);
  border-radius: 30px;
  padding: 9px 14px;
  color: var(--muted);
  background: var(--panel);
  font-size: 11px;
  transition: .2s;
}
.level-filters button:hover,
.level-filters button.selected {
  color: var(--text);
  border-color: var(--gold);
  background: var(--panel-soft);
  box-shadow: inset 0 -2px var(--gold);
}
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 12px;
  margin-bottom: 17px;
}
.section-title h2 {
  font: 700 22px 'Manrope', sans-serif;
  letter-spacing: -.6px;
  margin: 0;
}
.course-count { color: var(--muted); font-size: 11px; }
.course-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
}
.course-card {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--panel);
  min-width: 0;
  transition: transform .2s, border-color .2s;
}
.course-card:hover {
  transform: translateY(-3px);
  border-color: var(--gold);
}
.course-art {
  height: 145px;
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #244b37, #10271d);
}
.course-art::before,
.course-art::after {
  content: '';
  position: absolute;
  border: 1px solid rgba(239, 216, 160, .35);
  width: 145px;
  height: 180px;
  border-radius: 100px 100px 0 0;
  bottom: -96px;
}
.course-art::after {
  width: 115px;
  height: 145px;
  bottom: -74px;
}
.art-icon {
  position: relative;
  z-index: 1;
  color: #f2dba0;
  font-size: 48px;
}
.art-rose { background: linear-gradient(135deg, #d9aeb5, #f5e4dc); }
.art-sage { background: linear-gradient(135deg, #9bb69d, #3c604b); }
.art-gold { background: linear-gradient(135deg, #c3a46e, #625035); }
.art-lavender { background: linear-gradient(135deg, #b8a8ca, #655775); }
.art-rose .art-icon { color: #fff5f0; }
.art-sage .art-icon { color: #f1f0d9; }
.art-lavender .art-icon { color: #fff5f0; }
.art-ornament {
  position: absolute;
  top: 12px;
  right: 15px;
  font-size: 22px;
  color: rgba(255,255,255,.75);
}
.art-label {
  position: absolute;
  left: 12px;
  bottom: 12px;
  z-index: 1;
  padding: 6px 9px;
  border: 1px solid rgba(255,255,255,.24);
  border-radius: 30px;
  color: white;
  background: rgba(20,35,25,.25);
  font-size: 9px;
}
.course-content { padding: 15px; }
.course-content h3 {
  font: 700 14px 'Manrope', sans-serif;
  margin: 0 0 9px;
  line-height: 1.5;
}
.course-content > p {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.7;
  min-height: 57px;
  margin: 0;
}
.course-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 15px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  font-size: 10px;
}
.course-meta span:first-child { color: var(--muted); }
.course-meta span:last-child { color: var(--gold); font-weight: 700; }
.empty-results {
  padding: 45px 15px;
  text-align: center;
  border: 1px dashed var(--border);
  border-radius: 16px;
}
.empty-results > span { color: var(--gold); font-size: 32px; }
.empty-results h3 { margin: 10px 0; }
.empty-results p { color: var(--muted); font-size: 12px; }
.source-note {
  display: flex;
  gap: 13px;
  align-items: start;
  margin-top: 28px;
  padding: 16px;
  border-radius: 13px;
  background: var(--panel-soft);
  color: var(--muted);
}
.source-note > span { color: var(--gold); font-size: 20px; }
.source-note p { font-size: 11px; line-height: 1.8; margin: 0; }

@media (max-width: 1050px) {
  .course-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 560px) {
  .learning-page { padding-top: 18px; }
  .heading-decoration { font-size: 42px; padding: 0; }
  .welcome-card { padding: 17px; gap: 13px; }
  .welcome-icon { flex-basis: 48px; width: 48px; height: 56px; font-size: 29px; }
  .welcome-card h2 { font-size: 16px; }
  .course-grid { grid-template-columns: 1fr; }
  .course-art { height: 165px; }
  .section-title h2 { font-size: 19px; }
}
</style>
