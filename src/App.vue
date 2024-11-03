<script setup>
import {onMounted, reactive, useTemplateRef, watch} from "vue";
import {compileString} from "sass";
import {forEach} from "lodash";
const stylesheet = useTemplateRef('stylesheet')

let settings = reactive({
  padding: { value: 25, unit: 'px'},
  color: 'black',
  bgColor: 'white',
  radius: { value: 10, unit: 'px'}
})
watch(settings, updateScssVars)
function updateScssVars() {
  let scssVars = '';
  forEach(settings,  (value, key) => {
    if (typeof value === 'string') {
      scssVars += '$'+key+': '+value+';\n'
    } else if (typeof value === 'object') {
      scssVars += '$'+key+': '+value.value  + value.unit +';\n'
    }
  })
  updateCss(scssVars)
}
function changeColor(color) {
  settings.color = color
}
function changeBgColor(color) {
  settings.bgColor = color
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
                  background: $bgColor;
                  border-radius: $radius;
                  border: hidden;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  flex-direction: column;
                  gap: 25px;
                  box-shadow: #222222 2px 2px 10px;
                  padding: 10px;
                }
                p {
                  color: $color;               
                  font-family: monospace;
                  text-shadow: #222222 2px 2px 10px;
                }
                p.title {
                  font-size: 24px;
                  font-weight: 900;
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
      <p class="title">DynamicStyles - A POC for Dynamic SASS</p>
      <div style="display: flex; gap: 10px; justify-content: center; align-items: center; width: 100%">
        <p>Main Colour</p>
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
      <div style="display: flex; gap: 10px; justify-content: center; align-items: center; width: 100%">
        <p>Background Colour</p>
        <button @click="changeBgColor('red')">Red</button>
        <button @click="changeBgColor('blue')">Blue</button>
        <button @click="changeBgColor('green')">Green</button>
        <button @click="changeBgColor('yellow')">Yellow</button>
        <button @click="changeBgColor('orange')">Orange</button>
        <button @click="changeBgColor('purple')">Purple</button>
        <button @click="changeBgColor('pink')">Pink</button>
        <button @click="changeBgColor('black')">Black</button>
        <button @click="changeBgColor('white')">White</button>
      </div>
      <div  style="display: flex; gap: 10px; justify-content: center; align-items: center; width: 100%">
        <p>Update Main Padding:</p>
        <input type="number" v-model="settings.padding.value" max="250" min="0" step="5">
        <div>|</div>
        <p>Update Radius:</p>
        <input type="number" v-model="settings.radius.value" max="250" min="0" step="5">
      </div>
    </div>
  </main>
  <div ref="stylesheet"></div>
</template>
