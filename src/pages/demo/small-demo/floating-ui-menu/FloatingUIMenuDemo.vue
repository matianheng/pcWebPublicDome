<template>
  <div class="w-100 h-44">
    <FloatingUIMenu
      :menu-data="menuDataArr"
      @click="onMenuItemClick"
    ></FloatingUIMenu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FloatingUIMenuType } from './FloatingUIMenu.d'
import FloatingUIMenu from './FloatingUIMenu.vue'

const menuDataArr = ref<FloatingUIMenuType[]>([
  { name: '菜单1', key: 1, children: buildMenuItemArr(10, 10) },
  { name: '菜单2', key: 2, children: buildMenuItemArr(10, 20) },
  { name: '菜单3', key: 3, children: buildMenuItemArr(10, 30) },
  { name: '菜单4', key: 4, children: buildMenuItemArr(10, 40) },
  { name: '菜单5', key: 5, children: buildMenuItemArr(10, 50) },
  { name: '菜单6', key: 6, children: buildMenuItemArr(10, 60) },
])

function buildMenuItemArr(count: number, keySeed: number) {
  return new Array(count).fill(true).map(_ => {
    const ret = {
      name: `菜单${keySeed}`,
      key: keySeed,
    }
    keySeed++
    return ret
  })
}

function onMenuItemClick(clickedMenuItem: FloatingUIMenuType) {
  console.log('clickedMenuItem', clickedMenuItem)
}
</script>

<style scoped></style>
./FloatingUIMenu
