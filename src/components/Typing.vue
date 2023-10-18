<template>
  <div class="  absolute top-1/3 left-2/3 transform    w-1/3 h-24 text-white    ">
    <div :class="{ 'cursor-blink': isTypingOrDeleting1 }"><span class="font-bold text-lg tracking-wide">{{
      animatedText1 }}</span>
    </div>
    <div :class="{ 'cursor-blink': isTypingOrDeleting2 }"><span class="font-bold ">{{ animatedText2 }}</span>
    </div>
    <div :class="{ 'cursor-blink': isTypingOrDeleting3 }"><span class="font-medium">{{ animatedText3 }}</span></div>
    <div :class="{ 'cursor-blink': isTypingOrDeleting4 }"><span class="font-light">{{ animatedText4 }}</span></div>
    <div :class="{ 'cursor-blink': isTypingOrDeleting5 }"><span class="font-extrabold text-lg">{{ animatedText5 }}</span>
    </div>
    <div :class="{ 'cursor-blink': isTypingOrDeleting5 }"><span class="font-extrabold text-lg">{{ animatedText6 }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      texts: {
        text1: ['Welcome !!  ', 400, 50, 3000],
        text2: ['  . . .   :)  ', 4700, 200, 4000],

        text3: ['You can rotate the camera in this 3D animation', 10000, 50, 3000],

        text4: [' You can also click on the cube! and bring GRAVITY BACK!! ', 20050, 50, 3000],
        text5: [' .  .  enjoy!!', 30050, 10, 3000],
        text6: [';)', 34050, 10, 3000],

      },
      animatedText1: '',
      animatedText2: '',
      animatedText3: '',
      animatedText4: '',
      animatedText5: '',
      animatedText6: '',
      currentIndex1: 0,
      currentIndex2: 0,
      currentIndex3: 0,
      currentIndex4: 0,
      currentIndex5: 0,
      currentIndex6: 0,
      isTypingOrDeleting1: false,
      isTypingOrDeleting2: false,
      isTypingOrDeleting3: false,
      isTypingOrDeleting4: false,
      isTypingOrDeleting5: false,
      isTypingOrDeleting6: false,
    };
  },
  created() {
    this.animateText('text1', 'animatedText1', 'currentIndex1', 'isTypingOrDeleting1');
    this.animateText('text2', 'animatedText2', 'currentIndex2', 'isTypingOrDeleting2');
    this.animateText('text3', 'animatedText3', 'currentIndex3', 'isTypingOrDeleting3');
    this.animateText('text4', 'animatedText4', 'currentIndex4', 'isTypingOrDeleting4');
    this.animateText('text5', 'animatedText5', 'currentIndex5', 'isTypingOrDeleting5');
    this.animateText('text6', 'animatedText6', 'currentIndex6', 'isTypingOrDeleting6');
  },
  methods: {
    animateText(textKey, animatedTextKey, currentIndexKey, isTypingOrDeleting) {
      const [text, initialDelay, typingSpeed, stayDuration] = this.texts[textKey];
      setTimeout(() => {
        this[isTypingOrDeleting] = true;
        let intervalId = setInterval(() => {
          if (this[currentIndexKey] < text.length) {
            this[animatedTextKey] += text[this[currentIndexKey]];
            this[currentIndexKey]++;
          } else {
            clearInterval(intervalId);
            setTimeout(() => {
              intervalId = setInterval(() => {
                if (this[animatedTextKey].length > 0) {
                  this[animatedTextKey] = this[animatedTextKey].slice(0, -1);
                } else {
                  clearInterval(intervalId);
                  this[currentIndexKey] = 0;
                  this[isTypingOrDeleting] = false;
                }
              }, typingSpeed / 2);
            }, stayDuration);
          }
        }, typingSpeed);
      }, initialDelay);
    },
  },
};
</script>

<style scoped>
@keyframes blink {

  0%,
  100% {
    opacity: 0;
  }



  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}



.cursor-blink span:after {
  content: '|';
  animation: blink 1s infinite;
  margin-left: 2px;
}
</style>
