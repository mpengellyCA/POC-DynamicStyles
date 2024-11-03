<script setup>
import {onMounted, reactive, useTemplateRef, watch} from "vue";
import {compileString} from "sass";
import {forEach} from "lodash";
const stylesheet = useTemplateRef('stylesheet')

let settings = reactive({
  padding: '25px',
  color: 'black'
})
watch(settings, updateScssVars)
function updateScssVars() {
  let scssVars = '';
  forEach(settings,  (value, key) => {
    scssVars += '$'+key+': '+value+';\n'
  })
  updateCss(scssVars)
}
function changeColor(color) {
  settings.color = color
}
function changePadding(padding) {
  settings.padding = padding
}
function updateCss(scssVars) {
  let scss = `main {
                  height: 100vh;
                  width: 100vw;
                  background: $color;
                  padding: $padding;
                }
                .container {
                  width: 100%;
                  height: 100%;
                  background: white;
                  border-radius: 10px;
                  border: hidden;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  flex-direction: column;
                  gap: 25px;
                  box-shadow: #222222 2px 2px 10px;
                }
                p {
                  color: $color;
                  font-size: 24px;
                  font-weight: 900;
                  font-family: monospace;
                  text-shadow: #222222 2px 2px 10px;
                }
                `
  stylesheet.value.innerHTML = '<style>' + compileString(scssVars + scss).css + `</style>`
}
onMounted(() => {
  updateScssVars()
})
</script>
<template>
  <main>
    <div class="container">
      <p>Hello World</p>
      <div style="display: flex; gap: 10px; justify-content: center; align-items: center; width: 100%">
        <button @click="changeColor('red')">Red</button>
        <button @click="changeColor('blue')">Blue</button>
        <button @click="changeColor('green')">Green</button>
        <button @click="changeColor('yellow')">Yellow</button>
        <button @click="changeColor('orange')">Orange</button>
        <button @click="changeColor('purple')">Purple</button>
        <button @click="changeColor('pink')">Pink</button>
        <button @click="changeColor('black')">Black</button>
        <button @click="changeColor('white')">White</button>
      </div>
      <div  style="display: flex; gap: 10px; justify-content: center; align-items: center; width: 100%">
        <button @click="changePadding('25px')">Padding 25</button>
        <button @click="changePadding('50px')">Padding 50</button>
        <button @click="changePadding('75px')">Padding 75</button>
        <button @click="changePadding('100px')">Padding 100</button>
      </div>
    </div>
  </main>
  <div ref="stylesheet"></div>
</template>
