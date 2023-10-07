<template>
  <div>
    <nav class="flex p-14" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center" v-for="(item, index) in breadcrumbItems" :key="index">
          <div class="flex items-center">
            <svg v-if="index !== 0" class="w-3 h-3 text-gray-400 mx-1" aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 9 4-4-4-4" />
            </svg>
            <a :href="item.link"
              class="ml-1 text-sm font-medium text-gray-400 hover:text-blue-300 md:ml-2 dark:text-gray-200 dark:hover:text-white"
              v-if="!item.isCurrent">
              {{ item.label }}
            </a>
            <span v-else class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
              {{ item.label }}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      breadcrumbItems: [
        { label: 'Home', link: '#', isCurrent: false },
        { label: 'Projects', link: '#', isCurrent: false },
        { label: 'First', link: '#', isCurrent: true }
      ]
    }
  }
}
</script>

<style ></style>
