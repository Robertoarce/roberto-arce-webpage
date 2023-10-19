<template>
  <div class="absolute left-0 z-20">
    <!-- Button to toggle the drawer -->
    <button @click="toggleDrawer" class="absolute left-0 mt-24  bg-blue-500 hover:bg-green-700  text-white
      shadow-xl  
      font-bold py-7  px-5 rounded-t-full transform rotate-90 -translate-y-1/2  ">
      Click Here
    </button>

    <!-- Overlay -->
    <div v-if="isDrawerOpen" class="fixed inset-0 bg-black opacity-50" @click="toggleDrawer"></div>

    <!-- Drawer -->
    <transition name="slide">
      <div v-if="isDrawerOpen" class="fixed inset-y-0 left-0 z-50 h-full w-64 p-4 bg-gray-200 dark:bg-gray-800 transform">

        <!-- Close button -->
        <button @click="toggleDrawer"
          class="mb-4 mt-5 ml-10 px-5 py-1 bg-slate-700 hover:bg-red-500  text-gray-100 font-bold rounded-full">
          Close
        </button>

        <!-- Drawer content -->
        <div class="text-white ">

          <div class="py-4 overflow-y-auto">
            <ul class="space-y-2 font-medium">





              <!-- Diplomas -->
              <li>
                <a href="#"
                  class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  @click="send_vision('diplomas')">

                  <svg
                    class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 21">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
                      d="M7.24 7.194a24.16 24.16 0 0 1 3.72-3.062m0 0c3.443-2.277 6.732-2.969 8.24-1.46 2.054 2.053.03 7.407-4.522 11.959-4.552 4.551-9.906 6.576-11.96 4.522C1.223 17.658 1.89 14.412 4.121 11m6.838-6.868c-3.443-2.277-6.732-2.969-8.24-1.46-2.054 2.053-.03 7.407 4.522 11.959m3.718-10.499a24.16 24.16 0 0 1 3.719 3.062M17.798 11c2.23 3.412 2.898 6.658 1.402 8.153-1.502 1.503-4.771.822-8.2-1.433m1-6.808a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z">
                    </path>
                  </svg>

                  <span class="ml-3"> Diplomas </span>
                </a>
              </li>
              <!-- Timeline -->
              <li>
                <a href="#"
                  class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  @click="send_vision('timeline')">

                  <div class="relative left-[5px] inline-block">
                    <svg
                      class="absolute top-[-8px] left-[-10px] z-[-1] flex-shrink-0 w-5 h-5text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        d="M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-11a1 1 0 0 0 1-1V1a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1Zm0 12a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1ZM4.343 5.757a1 1 0 0 0 1.414-1.414L4.343 2.929a1 1 0 0 0-1.414 1.414l1.414 1.414Zm11.314 8.486a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM4 10a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1Zm15-1h-2a1 1 0 1 0 0 2h2a1 1 0 0 0 0-2ZM4.343 14.243l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414a1 1 0 0 0-1.414-1.414ZM14.95 6.05a1 1 0 0 0 .707-.293l1.414-1.414a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 .707 1.707Z">

                      </path>
                    </svg>

                    <svg
                      class="relative right-[2px] z-[1] w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true" fill="currentColor" viewBox="0 0 14 18">
                      <path
                        d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />

                    </svg>
                  </div>
                  <span class="ml-3"> Curriculum Vitae </span>
                </a>
              </li>

              <!-- ------------------------ -->
              <!-- ------------------------ -->
              <!-- ------------------------ -->



              <div>
                <!-- Dropdown button -->
                <button @click="toggleDropdown"
                  class="text-white bg-green-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm pl-5 pr-8 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button">

                  <svg class="w-6 h-6 pr-3 text-gray-800 dark:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 15 20">
                    <path
                      d="M9.092 18h-4a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2Zm-2-18a7.009 7.009 0 0 0-7 7 7.8 7.8 0 0 0 2.219 5.123c.956 1.195 1.781 2.228 1.781 3.877a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1c0-1.7.822-2.7 1.774-3.868A7.63 7.63 0 0 0 14.092 7a7.009 7.009 0 0 0-7-7Zm0 5a2 2 0 0 0-2 2 1 1 0 0 1-2 0 4 4 0 0 1 4-4 1 1 0 0 1 0 2Z" />
                  </svg>


                  Visual ART
                  <svg class="w-2.5 h-2.5 ml-2.5 " aria-hidden=" true" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m1 1 4 4 4-4" />
                  </svg>
                </button>

                <!-- Dropdown menu -->
                <div v-if="dropdownVisible"
                  class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">


                  <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 ">


                    <li>
                      <a href="#"
                        class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-900 dark:hover:bg-gray-500 group"
                        @click="send_vision('coliders')">

                        <svg class=" flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400
                              group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                          <path d="M10 13c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6Z" />
                        </svg>



                        <span class="ml-3"> Shaky Circles </span>
                      </a>
                    </li>

                    <!-- bug cube -->
                    <li>
                      <a href="#"
                        class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-500 group"
                        @click="send_vision('cube')">
                        <svg
                          class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                          aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M7 3 6 2V1m5 2 1-1V1M9 7v11M9 7a5 5 0 0 1 5 5M9 7a5 5 0 0 0-5 5m5-5a4.959 4.959 0 0 1 2.973 1H12V6a3 3 0 0 0-6 0v2h.027A4.959 4.959 0 0 1 9 7Zm-5 5H1m3 0v2a5 5 0 0 0 10 0v-2m3 0h-3m-9.975 4H2a1 1 0 0 0-1 1v2m13-3h2.025a1 1 0 0 1 1 1v2M13 9h2.025a1 1 0 0 0 1-1V6m-11 3H3a1 1 0 0 1-1-1V6">
                          </path>
                        </svg>

                        <span class="ml-3"> 3D - Cube </span>
                      </a>
                    </li>

                    <!-- Circles Network -->
                    <li>
                      <a href="#"
                        class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-500 group"
                        @click="send_vision('network')">
                        <svg
                          class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                          aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 6h8M6 6v8m0-8V3.5A2.5 2.5 0 1 0 3.5 6H6Zm8 0v8m0-8h2.5A2.5 2.5 0 1 0 14 3.5V6Zm0 8H6m8 0h2.5a2.5 2.5 0 1 1-2.5 2.5V14Zm-8 0H3.5A2.5 2.5 0 1 0 6 16.5V14Z">
                          </path>
                        </svg>



                        <span class="ml-3"> The Network </span>
                      </a>
                    </li>


                  </ul>
                </div>
              </div>


              <!-- ------------------------ -->
              <!-- ------------------------ -->
              <!-- 2D Circles  -->


              <!-- --Portfolio-- -->

              <li>
                <a href="#"
                  class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">

                  <svg
                    class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M19.728 10.686c-2.38 2.256-6.153 3.381-9.875 3.381-3.722 0-7.4-1.126-9.571-3.371L0 10.437V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7.6l-.272.286Z">
                    </path>
                    <path
                      d="m.135 7.847 1.542 1.417c3.6 3.712 12.747 3.7 16.635.01L19.605 7.9A.98.98 0 0 1 20 7.652V6a2 2 0 0 0-2-2h-3V3a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v1H2a2 2 0 0 0-2 2v1.765c.047.024.092.051.135.082ZM10 10.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5ZM7 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1H7V3Z">
                    </path>
                  </svg>

                  <span class="ml-3"> Portfolio </span>
                </a>
              </li>

            </ul>

          </div>
        </div>
      </div>
    </transition>


  </div>
</template>

<script>
export default {


  props: ['vision'],

  data() {
    return {
      isDrawerOpen: false,
      bodyOverflow: '',
      dropdownVisible: false
    }
  },

  methods: {

    toggleDrawer() {
      this.isDrawerOpen = !this.isDrawerOpen;
      if (this.isDrawerOpen) {
        this.bodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = this.bodyOverflow;
      }
    },

    send_vision(page) {
      this.toggleDrawer();
      this.$emit('sent_page', page);

    },


    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    }




  }
}
</script>

<style scoped>
/* Custom transition classes for the slide effect */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

.slide-enter-to,
.slide-leave-from {
  transform: translateX(0%);
}
</style>
