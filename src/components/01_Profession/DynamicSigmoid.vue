<template>
  <div class="dynamic-sigmoid-container bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-10">
    <div class="controls-section bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
      <h2 class="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300">Dynamic Sigmoid Function</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="slider-group">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">L (max value): <span class="font-semibold">{{ L.toFixed(2) }}</span></label>
          <input type="range" min="0.1" max="5" step="0.1" v-model.number="L" class="w-full" />
        </div>
        <div class="slider-group">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">k (slope): <span class="font-semibold">{{ k.toFixed(2) }}</span></label>
          <input type="range" min="-10" max="10" step="0.1" v-model.number="k" class="w-full" />
        </div>
        <div class="slider-group">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">x₀ (midpoint): <span class="font-semibold">{{ x0.toFixed(2) }}</span></label>
          <input type="range" min="-10" max="10" step="0.1" v-model.number="x0" class="w-full" />
        </div>
        <div class="slider-group">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">y₀ (vertical offset): <span class="font-semibold">{{ y0.toFixed(2) }}</span></label>
          <input type="range" min="-2" max="2" step="0.1" v-model.number="y0" class="w-full" />
        </div>
      </div>
      <div class="mt-4 text-sm text-gray-600 dark:text-gray-300">
        y(x) = y₀ + L / (1 + exp(-k · (x - x₀)))
      </div>
    </div>

    <div class="graph-section bg-white dark:bg-gray-800 shadow-lg rounded-lg flex flex-col items-center justify-center">
      <div ref="plotlyGraph" class="plotly-graph"></div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, nextTick } from 'vue'
import Plotly from 'plotly.js-dist-min'

export default {
  name: 'DynamicSigmoid',
  setup() {
    const plotlyGraph = ref(null)

    const L = ref(1)
    const k = ref(1)
    const x0 = ref(0)
    const y0 = ref(0)

    const xDomainMin = -10
    const xDomainMax = 10
    const numPoints = 400

    const generateX = () => {
      const xs = []
      const step = (xDomainMax - xDomainMin) / (numPoints - 1)
      for (let i = 0; i < numPoints; i++) {
        xs.push(xDomainMin + i * step)
      }
      return xs
    }

    const computeY = (xs) => {
      const ys = new Array(xs.length)
      for (let i = 0; i < xs.length; i++) {
        const t = -k.value * (xs[i] - x0.value)
        const denom = 1 + Math.exp(t)
        ys[i] = y0.value + L.value / denom
      }
      return ys
    }

    const draw = () => {
      const xs = generateX()
      const ys = computeY(xs)
      const data = [
        {
          x: xs,
          y: ys,
          mode: 'lines',
          type: 'scatter',
          line: { color: '#3B82F6', width: 3 },
          name: 'Sigmoid'
        }
      ]
      const layout = {
        title: 'Sigmoid Function',
        xaxis: { title: 'x', range: [xDomainMin, xDomainMax] },
        yaxis: { title: 'y', automargin: true },
        margin: { l: 60, r: 20, t: 40, b: 60 }
      }
      if (plotlyGraph.value) {
        Plotly.newPlot(plotlyGraph.value, data, layout, { responsive: true })
      }
    }

    const update = () => {
      const xs = generateX()
      const ys = computeY(xs)
      if (plotlyGraph.value) {
        Plotly.react(
          plotlyGraph.value,
          [
            {
              x: xs,
              y: ys,
              mode: 'lines',
              type: 'scatter',
              line: { color: '#3B82F6', width: 3 },
              name: 'Sigmoid'
            }
          ],
          {
            title: 'Sigmoid Function',
            xaxis: { title: 'x', range: [xDomainMin, xDomainMax] },
            yaxis: { title: 'y', automargin: true },
            margin: { l: 60, r: 20, t: 40, b: 60 }
          },
          { responsive: true }
        )
      }
    }

    onMounted(() => {
      nextTick(() => draw())
    })

    watch([L, k, x0, y0], () => {
      update()
    })

    return {
      plotlyGraph,
      L,
      k,
      x0,
      y0
    }
  }
}
</script>

<style scoped>
.dynamic-sigmoid-container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  height: 95vh;
  gap: 20px;
  overflow-x: hidden;
}

.controls-section {
  flex: 1;
  overflow: auto;
}

.graph-section {
  flex: 1;
  padding: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.plotly-graph {
  width: 100%;
  height: 80%;
}
</style>


