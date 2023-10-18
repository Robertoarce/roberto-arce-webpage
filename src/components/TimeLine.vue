<template>
  <div class="basolute v-full h-full object-fill bg-opacity-30 p-0 m-0  overflow-hidden ">


    <div
      class="p-10 pb-10 m-10 bg-emerald-900 bg-opacity-40 overflow-y-auto max-h-[calc(100vh-10rem)] no-scrollbar shadow-md rounded-lg ">
      <div
        class="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        <!-- Loop starts here -->
        <div v-for="(work, index) in works" :key="index"
          class="relative flex   items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

          <!-- Icon -->
          <div :class="[
            'flex items-center justify-center w-10 h-10 rounded-full border border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2',
            index === 0 ? 'bg-blue-500 text-white' : index === works.length - 1 ? 'bg-violet-500 text-white' : 'bg-slate-400 text-slate-900'
          ]">

            <svg v-if="work.study" class="w-6 h-6 text-gray-800 dark:text-black" aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M1 17V2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M5 15V1m8 18v-4" />
            </svg>

            <svg v-if="!work.study" class="fill-current" xmlns="http://www.w3.org/2000/svg" width="12" height="10">
              <path fill-rule="nonzero" d="M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7" />
            </svg>
          </div>

          <!-- Card -->
          <div
            :class="['w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 mb-4 rounded-3xl  shadow-xl \
                                                                         hover:border-2 hover:mb-1  hover:shadow-none'

              , work.study == true ? 'border-amber-400 hover:bg-amber-100 hover:bg-opacity-45  ' : 'border-sky-400 hover:bg-sky-100   hover:bg-opacity-95']">

            <div class="flex items-center justify-between space-x-2 mb-1">
              <div class="font-bold text-slate-900">{{ work.title }}</div>
              <time class="font-caveat font-medium text-indigo-500">{{ work.date }}</time>
            </div>
            <div class="text-slate-500">{{ work.description }}</div>
            <div class="text-slate-500">Utilities: {{ work.utils.join(', ') }}</div>
          </div>
        </div>
        <!-- Loop ends here -->
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      works: [
        {
          title: 'Politecnico Milano',
          date: '2023-October',
          description: "Data Scientist",
          utils: ['Python', 'Numpy', 'Bash'],
          study: false
        },
        {
          title: 'Politecnico Msssilano',
          date: '2023-October',
          description: "Data Scientist",
          utils: ['Python', 'Numpy', 'Bash'],
          study: true
        }, {
          title: 'Politecnico Milano',
          date: '2023-October',
          description: "Data Scientist",
          utils: ['Python', 'Numpy', 'Bash'],
          study: false
        },
        {
          title: 'Politecnico Milano',
          date: '2023-October',
          description: "Data Scientist",
          utils: ['Python', 'Numpy', 'Bash'],
          study: false
        }, {
          title: 'Politecnico ssssMilano',
          date: '2023-October',
          description: "Data Scientist",
          utils: ['Python', 'Numpy', 'Bash'],
          study: true
        },
        {
          title: 'Politecnico Milano',
          date: '2023-October',
          description: "Data Scientist",
          utils: ['Python', 'Numpy', 'Bash'],
          study: false
        },
      ]
    }
  }
}
</script>

<style>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}
</style>
