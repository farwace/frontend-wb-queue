<template>
  <svg xmlns="http://www.w3.org/2000/svg" class="spinner" width="64px" height="64px" viewBox="0 0 66 66">
    <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" stroke-dasharray="187" cx="33" cy="33" r="29"/>
  </svg>
</template>
<style scoped>
@keyframes rotator {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(720deg); }
}

@keyframes dash {
  0% {
    stroke-dashoffset: 187;
  }
  30% {
    stroke-dashoffset: 45;
  }
  100% {
    stroke-dashoffset: 187;
  }
}

@keyframes colors {
  0% { stroke: #EC4DF0; }
  25% { stroke: #E639CA; }
  50% { stroke: #AC43FE; }
  75% { stroke: #7A18DD; }
  100% { stroke: #EC4DF0; }
}

circle {
  transform-origin: center;
  animation:
      rotator 1.4s linear infinite,
      dash 1.4s linear infinite,
      colors 5.6s ease-in-out infinite;
}
</style>
<script setup lang="ts">
</script>