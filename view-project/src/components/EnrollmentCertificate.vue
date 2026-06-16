<template>
  <div class="cert-page">

    <!-- Header -->
    <header class="cert-header">
      <div class="header-inner">
        <RouterLink to="/" class="back-btn">← Inicio</RouterLink>
        <div class="header-center">
          <div class="epis-badge">EPIS</div>
          <div class="header-text">
            <h1>Constancia de Matrícula de Laboratorio</h1>
            <p>Escuela Profesional de Ingeniería de Sistemas</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Search -->
    <section class="search-section">
      <div class="search-card">
        <label class="search-label">Código Único de Identificación (C.U.I.)</label>
        <div class="search-row">
          <input
            v-model="cuiInput"
            type="number"
            placeholder="Ej: 20250101"
            class="search-input"
            @keyup.enter="fetchCertificate"
            :disabled="loading"
          />
          <button class="search-btn" @click="fetchCertificate" :disabled="loading || !cuiInput">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Consultar</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Error -->
    <div v-if="error" class="state-box error-box">
      <span class="state-icon">⚠️</span>
      <p>{{ error }}</p>
    </div>

    <!-- Empty -->
    <div v-else-if="searched && results.length === 0 && !loading" class="state-box empty-box">
      <span class="state-icon">🎓</span>
      <p>No se encontraron matrículas para el C.U.I. <strong>{{ lastCui }}</strong>.</p>
    </div>

    <!-- Certificate -->
    <main v-else-if="results.length > 0" class="cert-body">

      <!-- Student -->
      <section class="info-card">
        <div class="card-label">Datos del Alumno</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-key">C.U.I.</span>
            <span class="info-val"><span class="cui-chip">{{ student.cui }}</span></span>
          </div>
          <div class="info-item">
            <span class="info-key">Nombre completo</span>
            <span class="info-val">{{ student.full_name }}</span>
          </div>
          <div class="info-item">
            <span class="info-key">Email</span>
            <span class="info-val">{{ student.email ?? '—' }}</span>
          </div>
          <div class="info-item">
            <span class="info-key">Fecha de emisión</span>
            <span class="info-val">{{ emissionDate }}</span>
          </div>
        </div>
      </section>

      <!-- Courses -->
      <section class="info-card">
        <div class="card-label">Asignaturas Matriculadas</div>
        <div class="courses-list">
          <div
            v-for="(enrollment, index) in results"
            :key="enrollment.id"
            class="course-item"
          >
            <div class="course-num">{{ index + 1 }}</div>
            <div class="course-main">
              <div class="course-top">
                <span class="course-name">{{ enrollment.workload.course.name }}</span>
                <span class="course-acronym">{{ enrollment.workload.course.acronym }}</span>
              </div>
              <div class="course-meta">
                <span class="meta-pill">Cód. {{ enrollment.workload.course.code }}</span>
                <span class="meta-pill">{{ enrollment.workload.course.year_display }}</span>
                <span class="meta-pill">{{ enrollment.workload.course.semester_display }}</span>
                <span class="meta-pill">{{ enrollment.workload.course.credits }} créditos</span>
              </div>
            </div>
            <div class="course-aside">
              <div class="aside-row">
                <span class="aside-label">Grupo</span>
                <span class="group-badge">{{ enrollment.workload.group }}</span>
              </div>
              <div class="aside-row">
                <span class="aside-label">Lab</span>
                <span class="aside-val">{{ enrollment.workload.laboratory }}</span>
              </div>
              <div class="aside-row">
                <span class="aside-label">Docente</span>
                <span class="aside-val teacher">{{ enrollment.workload.teacher.full_name }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="total-row">
          <span>Total de cursos matriculados:</span>
          <strong>{{ results.length }}</strong>
        </div>
      </section>

      <p class="doc-footer">
        Documento generado digitalmente por el Sistema de Matrícula de Laboratorio EPIS.
      </p>
    </main>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

// Modifica la constante BASE_URL para que quede así:
const BASE_URL = '/api-backend/restful/enrollment-certificate/'

const cuiInput = ref('')
const loading  = ref(false)
const error    = ref(null)
const searched = ref(false)
const lastCui  = ref('')
const results  = ref([])

const student = computed(() => results.value[0]?.student ?? {})

const emissionDate = computed(() => {
  const raw = results.value[0]?.created
  if (!raw) return '—'
  return new Date(raw).toLocaleDateString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
})

async function fetchCertificate() {
  if (!cuiInput.value) return
  loading.value  = true
  error.value    = null
  results.value  = []
  searched.value = false
  lastCui.value  = cuiInput.value

  try {
    const res = await fetch(`${BASE_URL}?cui=${cuiInput.value}`)
    if (!res.ok) throw new Error(`Error del servidor: ${res.status}`)
    const data = await res.json()
    results.value  = data.results ?? []
    searched.value = true
  } catch (err) {
    error.value = err.message || 'No se pudo conectar con el servidor.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.cert-page {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  color: #0f172a;
}

/* Header */
.cert-header {
  background: linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%);
  padding: 20px 28px;
  box-shadow: 0 4px 24px rgba(30,58,95,.3);
}
.header-inner {
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
}
.back-btn {
  color: rgba(255,255,255,.75);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  transition: color .2s;
  flex-shrink: 0;
}
.back-btn:hover { color: #fff; }
.header-center {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
}
.epis-badge {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: rgba(255,255,255,.15);
  border: 2px solid rgba(255,255,255,.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 1px;
  color: #fff;
  flex-shrink: 0;
}
.header-text h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}
.header-text p {
  margin: 2px 0 0;
  font-size: 12px;
  color: rgba(255,255,255,.65);
}

/* Search */
.search-section {
  max-width: 860px;
  margin: 24px auto 0;
  padding: 0 20px;
}
.search-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: 0 1px 8px rgba(0,0,0,.06);
}
.search-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .6px;
  color: #64748b;
  margin-bottom: 10px;
}
.search-row {
  display: flex;
  gap: 10px;
}
.search-input {
  flex: 1;
  padding: 11px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
  transition: border-color .2s;
  background: #f8fafc;
  color: #0f172a;
}
.search-input:focus { border-color: #2563eb; background: #fff; }
.search-input:disabled { opacity: .6; }
.search-btn {
  padding: 11px 26px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background .2s, opacity .2s;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
.search-btn:hover:not(:disabled) { background: #1d4ed8; }
.search-btn:disabled { opacity: .55; cursor: not-allowed; }
.spinner {
  width: 16px; height: 16px;
  border: 2.5px solid rgba(255,255,255,.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* States */
.state-box {
  max-width: 860px;
  margin: 24px auto 0;
  padding: 28px 24px;
  border-radius: 14px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.state-icon { font-size: 32px; }
.error-box { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; }
.empty-box { background: #fff; border: 1px solid #e2e8f0; color: #64748b; }

/* Cert body */
.cert-body {
  max-width: 860px;
  margin: 22px auto 48px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Cards */
.info-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 8px rgba(0,0,0,.05);
}
.card-label {
  background: linear-gradient(90deg, #1e3a5f, #2563eb);
  color: #fff;
  padding: 10px 22px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* Student grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.info-item {
  padding: 16px 22px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  border-bottom: 1px solid #f1f5f9;
}
.info-key {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .5px;
  color: #94a3b8;
}
.info-val {
  font-size: 15px;
  font-weight: 500;
  color: #0f172a;
}
.cui-chip {
  display: inline-block;
  background: #dbeafe;
  color: #1d4ed8;
  padding: 2px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
}

/* Courses */
.courses-list { display: flex; flex-direction: column; }
.course-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 18px 22px;
  border-bottom: 1px solid #f1f5f9;
  transition: background .15s;
}
.course-item:last-child { border-bottom: none; }
.course-item:hover { background: #f8fafc; }
.course-num {
  width: 28px; height: 28px;
  border-radius: 8px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 12px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 2px;
}
.course-main { flex: 1; min-width: 0; }
.course-top {
  display: flex; align-items: center;
  gap: 10px; flex-wrap: wrap; margin-bottom: 8px;
}
.course-name { font-size: 14px; font-weight: 700; color: #0f172a; }
.course-acronym {
  background: #f1f5f9; color: #64748b;
  font-size: 11px; font-weight: 700;
  padding: 2px 8px; border-radius: 6px;
}
.course-meta { display: flex; flex-wrap: wrap; gap: 6px; }
.meta-pill {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 11px; font-weight: 500;
  padding: 3px 9px; border-radius: 20px;
}
.course-aside {
  display: flex; flex-direction: column;
  gap: 6px; min-width: 170px; flex-shrink: 0;
}
.aside-row { display: flex; align-items: center; gap: 8px; }
.aside-label {
  font-size: 11px; font-weight: 600;
  color: #94a3b8; text-transform: uppercase;
  letter-spacing: .4px; width: 48px; flex-shrink: 0;
}
.aside-val { font-size: 13px; font-weight: 500; color: #0f172a; }
.teacher { font-size: 12px; }
.group-badge {
  width: 26px; height: 26px;
  background: linear-gradient(135deg, #1e3a5f, #2563eb);
  color: #fff; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800;
}
.total-row {
  padding: 14px 22px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex; align-items: center; gap: 8px;
  font-size: 14px; color: #64748b;
}
.total-row strong { font-size: 20px; color: #1e3a5f; }

.doc-footer {
  text-align: center; font-size: 12px;
  color: #94a3b8; font-style: italic;
}

/* Responsive */
@media (max-width: 600px) {
  .info-grid { grid-template-columns: 1fr; }
  .course-item { flex-direction: column; gap: 12px; }
  .course-aside { min-width: unset; flex-direction: row; flex-wrap: wrap; }
  .search-row { flex-direction: column; }
  .search-btn { justify-content: center; }
  .header-text h1 { font-size: 15px; }
}
</style>