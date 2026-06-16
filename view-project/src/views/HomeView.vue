<template>
  <div class="home">
    <div class="home-card">
      <div class="epis-logo">EPIS</div>
      <h1>Sistema de Matrícula</h1>
      <p>Escuela Profesional de Ingeniería de Sistemas</p>
      <RouterLink to="/certificado" class="btn-primary">
        Consultar Constancia de Matrícula
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%);
  padding: 20px;
}
.home-card {
  background: #fff;
  border-radius: 20px;
  padding: 48px 40px;
  text-align: center;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,.25);
}
.epis-logo {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #1e3a5f, #2563eb);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 1px;
  color: #fff;
  margin: 0 auto 20px;
}
h1 {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}
p {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 28px;
}
.btn-primary {
  display: inline-block;
  padding: 13px 28px;
  background: linear-gradient(135deg, #1e3a5f, #2563eb);
  color: #fff;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  transition: opacity .2s;
}
.btn-primary:hover { opacity: .88; }
</style>