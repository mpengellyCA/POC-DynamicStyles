<script setup>
import {onMounted, onUpdated, reactive, ref, useTemplateRef, watch} from "vue";
import {compileString} from "sass";
import {forEach} from "lodash";
import scss from './assets/styles.scss?raw'
import {createTailwindcss} from "@mhsdesign/jit-browser-tailwindcss";
const main = useTemplateRef('main')
const spinning = ref(false)
const pulse = ref(false)
const wiggle = ref(false)
const stylesheet = ref('<style></style>')
let settings = reactive({
  padding: { value: 25, unit: 'px'},
  color: 'black',
  bgColor: 'white',
  radius: { value: 10, unit: 'px'},
  fontSize: { value: 16, unit: 'px'},
  titleSize: { value: 24, unit: 'px'}
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
const tailwind = createTailwindcss({
  tailwindConfig: {
    // disable normalize css
    corePlugins: { preflight: false },
    theme: {
      extend: {
        animation: {
          'spin-slow': 'spin 10s linear infinite',
          wiggle: 'wiggle 1s ease-in-out infinite',
        },
        keyframes: {
          wiggle: {
            '0%, 100%': { transform: 'rotate(-3deg)' },
            '50%': { transform: 'rotate(3deg)' },
          }
        }
      }
    }
  }
})
function changeColor(color) {
  settings.color = color
}
function changeBgColor(color) {
  settings.bgColor = color
}
async function updateCss(scssVars) {
  const css = compileString(scssVars + scss).css
  const results = await tailwind.generateStylesFromContent(`@tailwind components;
    @tailwind utilities;` + css, [main.value.outerHTML])
  stylesheet.value = '<style>' + results + '</style>'
}
onMounted(updateScssVars)
onUpdated(updateScssVars)
</script>
<template>
  <main ref="main">
    <div class="wrapper" >
      <p class="title" :class="{'animate-spin-slow': spinning, 'animate-pulse': pulse, 'animate-wiggle': wiggle}">DynamicStyles - A POC for Dynamic SASS</p>
      <div class="flex gap-2 justify-center items-center w-full">
        <p class="mr-8">Main Colour:</p>
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
      <div class="flex gap-2 justify-center items-center w-full">
        <p class="mr-8">Background Colour:</p>
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
      <div class="flex gap-4 justify-center items-center w-full">
        <p>Update Main Padding:</p>
        <input type="number" v-model="settings.padding.value" max="250" min="0" step="5">
        <p>|</p>
        <p>Update Radius:</p>
        <input type="number" v-model="settings.radius.value" max="250" min="0" step="5">
      </div>
      <div class="flex gap-4 justify-center items-center w-full">
        <p>Font Size:</p>
        <input type="number" v-model="settings.fontSize.value" max="40" min="8" step="2">
        <p>|</p>
        <p>Title Size:</p>
        <input type="number" v-model="settings.titleSize.value" max="60" min="8" step="2">
      </div>
      <div class="flex gap-4 justify-center items-center w-full">
        <p class="mr-8">Animations:</p>
        <button @click="spinning = !spinning;">Spin</button>
        <button @click="pulse = !pulse;">Pulse</button>
        <button @click="wiggle = !wiggle;">Wiggle</button>
      </div>
    </div>
  </main>
  <div v-html="stylesheet"></div>
</template>
