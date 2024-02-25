 


    <template>
      <div>
  <canvas ref="canvas" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing"></canvas>
  <button >Comming Soon....</button>
</div>
</template>

    
 
<script>




export default {
  data() {
    return {
      model: null,
    };
  },
  async mounted() {
    this.model = await tf.loadLayersModel('path/to/model_web/model.json');
  },


  
  methods: {
    async predictDigit(canvas) {
      const tensor = tf.browser.fromPixels(canvas);
      const prediction = this.model.predict(tensor.expandDims(0));
      const predictedDigit = prediction.argMax(-1).dataSync()[0];
      alert(`Predicted digit is: ${predictedDigit}`);
    },
  },
};


</script>
<style >
  
</style>