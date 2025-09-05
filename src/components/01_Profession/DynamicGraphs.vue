<template>
  <div class="dynamic-graphs-container bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-10">
    <div class="controls-section bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
      <h2 class="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300">Dynamic Graphs</h2>

      <div class="mb-4 flex items-center gap-3">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Function</label>
        <select v-model="selectedFunction" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
          <option v-for="fn in functionOptions" :key="fn.value" :value="fn.value">{{ fn.label }}</option>
        </select>
        <button @click="showSliderSettings = !showSliderSettings" class="mt-1 whitespace-nowrap bg-slate-700 hover:bg-blue-600 text-white text-sm font-semibold px-3 py-2 rounded-md">
          {{ showSliderSettings ? 'Hide slider configs' : 'Modify sliders' }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="p in visibleParams" :key="p.key" class="slider-group">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ p.label }}: <span class="font-semibold">{{ formatParamValue(p) }}</span>
          </label>
          <input type="range" :min="p.min" :max="p.max" :step="p.step" v-model.number="params[p.key]" class="w-full" />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ paramEffect(p.key) }}</p>

          <div v-if="showSliderSettings" class="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div>
              <label class="block mb-1 text-gray-600 dark:text-gray-300">Min</label>
              <input type="number" class="w-full rounded-md bg-gray-100 dark:bg-gray-700 p-1"
                     v-model.number="p.min"
                     @change="ensureMinBeforeMax(p)" />
            </div>
            <div>
              <label class="block mb-1 text-gray-600 dark:text-gray-300">Max</label>
              <input type="number" class="w-full rounded-md bg-gray-100 dark:bg-gray-700 p-1"
                     v-model.number="p.max"
                     @change="ensureMinBeforeMax(p)" />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
        {{ currentFormula }}
      </div>
    </div>

    <div class="graph-section bg-white dark:bg-gray-800 shadow-lg rounded-lg flex flex-col items-center justify-center">
      <div ref="plotlyGraph" class="plotly-graph"></div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import Plotly from 'plotly.js-dist-min'

// Lanczos approximation for Gamma function
function gammaLanczos(z) {
  const p = [
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
  ]
  const g = 7
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gammaLanczos(1 - z))
  }
  z -= 1
  let x = 0.99999999999980993
  for (let i = 0; i < p.length; i++) {
    x += p[i] / (z + i + 1)
  }
  const t = z + g + 0.5
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x
}

function betaFunc(x, y) {
  return gammaLanczos(x) * gammaLanczos(y) / gammaLanczos(x + y)
}

function factorial(n) {
  if (n < 0) return NaN
  if (n === 0 || n === 1) return 1
  let res = 1
  for (let i = 2; i <= n; i++) res *= i
  return res
}

export default {
  name: 'DynamicGraphs',
  setup() {
    const plotlyGraph = ref(null)

    const functionOptions = [
      { value: 'sigmoid', label: 'Logistic (Sigmoid)' },
      { value: 'gamma', label: 'Gamma Function Γ(x)' },
      { value: 'beta', label: 'Beta PDF B(α, β)' },
      { value: 'exponential', label: 'Exponential y = a · e^{b x}' },
      { value: 'poisson', label: 'Poisson PMF' },
      { value: 'normal', label: 'Normal PDF' },
      { value: 'linear', label: 'Linear y = m x + b' },
      { value: 'polynomial', label: 'Polynomial' },
      { value: 'sine', label: 'Sine y = A sin(ωx + φ)' },
      { value: 'cosine', label: 'Cosine y = A cos(ωx + φ)' },
      { value: 'cubic', label: 'Cubic y = ax³ + bx² + cx + d' },
      { value: 'log', label: 'Logarithm y = a · ln(bx + c)' }
    ]

    const selectedFunction = ref('sigmoid')

    const params = ref({
      // Sigmoid
      L: 1, k: 1, x0: 0, y0: 0,
      // Gamma
      gamma_xmin: 0.01, gamma_xmax: 10,
      // Beta
      alpha: 2, beta: 5,
      // Exponential
      a: 1, b: 0.5,
      // Poisson
      lambda: 4, kmax: 20,
      // Normal
      mu: 0, sigma: 1,
      // Linear
      m: 1, b_lin: 0,
      // Polynomial (degree up to 4)
      p0: 0, p1: 1, p2: 0, p3: 0, p4: 0,
      // Sin/Cos
      A: 1, omega: 1, phi: 0,
      // Cubic
      a3: 1, a2: 0, a1: 0, a0: 0,
      // Logarithm
      log_a: 1, log_b: 1, log_c: 1
    })

    const paramSpecs = reactive({
      sigmoid: [
        { key: 'L', label: 'L (max value)', min: 0.1, max: 5, step: 0.1 },
        { key: 'k', label: 'k (slope)', min: -10, max: 10, step: 0.1 },
        { key: 'x0', label: 'x₀ (midpoint)', min: -10, max: 10, step: 0.1 },
        { key: 'y0', label: 'y₀ (offset)', min: -2, max: 2, step: 0.1 }
      ],
      gamma: [
        { key: 'gamma_xmin', label: 'x min', min: 0.01, max: 5, step: 0.01 },
        { key: 'gamma_xmax', label: 'x max', min: 5, max: 20, step: 0.1 }
      ],
      beta: [
        { key: 'alpha', label: 'α (alpha)', min: 0.5, max: 10, step: 0.1 },
        { key: 'beta', label: 'β (beta)', min: 0.5, max: 10, step: 0.1 }
      ],
      exponential: [
        { key: 'a', label: 'a', min: -5, max: 5, step: 0.1 },
        { key: 'b', label: 'b', min: -3, max: 3, step: 0.1 }
      ],
      poisson: [
        { key: 'lambda', label: 'λ (lambda)', min: 0.1, max: 15, step: 0.1 },
        { key: 'kmax', label: 'k max', min: 5, max: 40, step: 1 }
      ],
      normal: [
        { key: 'mu', label: 'μ (mean)', min: -5, max: 5, step: 0.1 },
        { key: 'sigma', label: 'σ (std dev)', min: 0.2, max: 5, step: 0.1 }
      ],
      linear: [
        { key: 'm', label: 'm (slope)', min: -5, max: 5, step: 0.1 },
        { key: 'b_lin', label: 'b (intercept)', min: -5, max: 5, step: 0.1 }
      ],
      polynomial: [
        { key: 'p4', label: 'x⁴ coeff', min: -1, max: 1, step: 0.01 },
        { key: 'p3', label: 'x³ coeff', min: -2, max: 2, step: 0.01 },
        { key: 'p2', label: 'x² coeff', min: -3, max: 3, step: 0.05 },
        { key: 'p1', label: 'x coeff', min: -5, max: 5, step: 0.1 },
        { key: 'p0', label: 'constant', min: -5, max: 5, step: 0.1 }
      ],
      sine: [
        { key: 'A', label: 'A (amplitude)', min: 0, max: 5, step: 0.1 },
        { key: 'omega', label: 'ω (frequency)', min: 0, max: 10, step: 0.1 },
        { key: 'phi', label: 'φ (phase)', min: -Math.PI, max: Math.PI, step: 0.01 }
      ],
      cosine: [
        { key: 'A', label: 'A (amplitude)', min: 0, max: 5, step: 0.1 },
        { key: 'omega', label: 'ω (frequency)', min: 0, max: 10, step: 0.1 },
        { key: 'phi', label: 'φ (phase)', min: -Math.PI, max: Math.PI, step: 0.01 }
      ],
      cubic: [
        { key: 'a3', label: 'a (x³)', min: -3, max: 3, step: 0.05 },
        { key: 'a2', label: 'b (x²)', min: -3, max: 3, step: 0.05 },
        { key: 'a1', label: 'c (x)', min: -5, max: 5, step: 0.1 },
        { key: 'a0', label: 'd (const)', min: -5, max: 5, step: 0.1 }
      ],
      log: [
        { key: 'log_a', label: 'a', min: -5, max: 5, step: 0.1 },
        { key: 'log_b', label: 'b', min: 0.01, max: 5, step: 0.01 },
        { key: 'log_c', label: 'c', min: -5, max: 5, step: 0.1 }
      ]
    })

    const showSliderSettings = ref(false)

    const formatParamValue = (p) => {
      const v = params.value[p.key]
      if (typeof v === 'number') return Number(v).toFixed(2)
      return v
    }

    const visibleParams = computed(() => paramSpecs[selectedFunction.value] || [])

    const ensureMinBeforeMax = (p) => {
      if (p.min >= p.max) {
        p.max = p.min + (p.step || 0.01)
      }
    }

    const effectsByFunction = {
      sigmoid: {
        L: 'Scales upper asymptote (height).',
        k: 'Controls steepness (slope) direction and magnitude.',
        x0: 'Horizontal shift; midpoint at x = x₀.',
        y0: 'Vertical shift of the whole curve.'
      },
      gamma: {
        gamma_xmin: 'Left bound of domain for plotting Γ(x).',
        gamma_xmax: 'Right bound of domain for plotting Γ(x).'
      },
      beta: {
        alpha: 'Skews distribution toward 1 as α increases.',
        beta: 'Skews distribution toward 0 as β increases.'
      },
      exponential: {
        a: 'Controls overall scale and direction.',
        b: 'Growth (>0) or decay (<0) rate.'
      },
      poisson: {
        lambda: 'Average rate; shifts mass to larger k as λ increases.',
        kmax: 'Max k displayed in the bar chart.'
      },
      normal: {
        mu: 'Mean; centers the bell curve.',
        sigma: 'Spread (standard deviation); larger σ flattens the curve.'
      },
      linear: {
        m: 'Slope (steepness and direction).',
        b_lin: 'Intercept; vertical shift at x = 0.'
      },
      polynomial: {
        p4: 'Controls quartic curvature and end behavior.',
        p3: 'Impacts cubic asymmetry and turning points.',
        p2: 'Quadratic curvature (opens up/down).',
        p1: 'Linear slope component.',
        p0: 'Vertical shift (y-intercept).'
      },
      sine: {
        A: 'Amplitude; peak-to-peak height.',
        omega: 'Angular frequency; more oscillations as ω increases.',
        phi: 'Phase shift; horizontal shift.'
      },
      cosine: {
        A: 'Amplitude; peak-to-peak height.',
        omega: 'Angular frequency; more oscillations as ω increases.',
        phi: 'Phase shift; horizontal shift.'
      },
      cubic: {
        a3: 'Controls cubic growth and inflection strength.',
        a2: 'Quadratic component affecting curvature.',
        a1: 'Linear component affecting slope.',
        a0: 'Vertical shift (y-intercept).'
      },
      log: {
        log_a: 'Vertical scale; flips sign when negative.',
        log_b: 'Horizontal scale inside ln; stretches/compresses.',
        log_c: 'Horizontal shift inside ln.'
      }
    }

    const paramEffect = (key) => {
      const map = effectsByFunction[selectedFunction.value] || {}
      return map[key] || 'Adjusts contribution of this parameter.'
    }

    const domain = computed(() => {
      switch (selectedFunction.value) {
        case 'sigmoid':
        case 'exponential':
        case 'linear':
        case 'polynomial':
        case 'sine':
        case 'cosine':
        case 'cubic':
        case 'log':
          return { xmin: -10, xmax: 10, points: 500 }
        case 'normal':
          return { xmin: params.value.mu - 5 * params.value.sigma, xmax: params.value.mu + 5 * params.value.sigma, points: 500 }
        case 'gamma':
          return { xmin: params.value.gamma_xmin, xmax: params.value.gamma_xmax, points: 500 }
        case 'beta':
          return { xmin: 0.0001, xmax: 0.9999, points: 500 }
        case 'poisson':
          return { xmin: 0, xmax: params.value.kmax, points: params.value.kmax + 1 }
        default:
          return { xmin: -10, xmax: 10, points: 500 }
      }
    })

    const currentFormula = computed(() => {
      switch (selectedFunction.value) {
        case 'sigmoid':
          return 'y(x) = y₀ + L / (1 + exp(-k · (x - x₀)))'
        case 'gamma':
          return 'Γ(x): Gamma function (Lanczos approximation)'
        case 'beta':
          return 'Beta PDF: f(x; α, β) = x^{α-1} (1-x)^{β-1} / B(α, β), x∈(0,1)'
        case 'exponential':
          return 'y(x) = a · e^{b x}'
        case 'poisson':
          return 'PMF: P(K=k) = e^{-λ} λ^{k} / k!, k=0,1,2,...'
        case 'normal':
          return 'PDF: f(x; μ,σ) = (1/(σ√(2π))) · e^{-(x-μ)²/(2σ²)}'
        case 'linear':
          return 'y(x) = m x + b'
        case 'polynomial':
          return 'y(x) = p4 x⁴ + p3 x³ + p2 x² + p1 x + p0'
        case 'sine':
          return 'y(x) = A sin(ωx + φ)'
        case 'cosine':
          return 'y(x) = A cos(ωx + φ)'
        case 'cubic':
          return 'y(x) = a x³ + b x² + c x + d'
        case 'log':
          return 'y(x) = a · ln(bx + c)'
        default:
          return ''
      }
    })

    function generateX(xmin, xmax, n) {
      const xs = []
      const step = (xmax - xmin) / (n - 1)
      for (let i = 0; i < n; i++) xs.push(xmin + i * step)
      return xs
    }

    function computeY(xs) {
      const p = params.value
      const fn = selectedFunction.value
      const ys = []
      if (fn === 'poisson') {
        // For Poisson, xs represent k = 0..kmax
        for (let k = 0; k <= p.kmax; k++) {
          const val = Math.exp(-p.lambda) * Math.pow(p.lambda, k) / factorial(k)
          ys.push(val)
        }
        return ys
      }

      for (let i = 0; i < xs.length; i++) {
        const x = xs[i]
        let y
        switch (fn) {
          case 'sigmoid':
            y = p.y0 + p.L / (1 + Math.exp(-p.k * (x - p.x0)))
            break
          case 'gamma':
            y = gammaLanczos(Math.max(0.0001, x))
            break
          case 'beta': {
            const a = p.alpha, b = p.beta
            if (x <= 0 || x >= 1) {
              y = 0
            } else {
              const num = Math.pow(x, a - 1) * Math.pow(1 - x, b - 1)
              const den = betaFunc(a, b)
              y = num / den
            }
            break
          }
          case 'exponential':
            y = p.a * Math.exp(p.b * x)
            break
          case 'normal':
            y = (1 / (p.sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - p.mu, 2) / (2 * p.sigma * p.sigma))
            break
          case 'linear':
            y = p.m * x + p.b_lin
            break
          case 'polynomial':
            y = (((p.p4 * x + p.p3) * x + p.p2) * x + p.p1) * x + p.p0
            break
          case 'sine':
            y = p.A * Math.sin(p.omega * x + p.phi)
            break
          case 'cosine':
            y = p.A * Math.cos(p.omega * x + p.phi)
            break
          case 'cubic':
            y = ((p.a3 * x + p.a2) * x + p.a1) * x + p.a0
            break
          case 'log': {
            const arg = p.log_b * x + p.log_c
            y = arg > 0 ? p.log_a * Math.log(arg) : NaN
            break
          }
          default:
            y = NaN
        }
        ys.push(y)
      }
      return ys
    }

    const draw = () => {
      const { xmin, xmax, points } = domain.value
      const xs = selectedFunction.value === 'poisson' ? Array.from({ length: points }, (_, i) => i) : generateX(xmin, xmax, points)
      const ys = computeY(xs)

      const data = [
        selectedFunction.value === 'poisson'
          ? {
              x: xs,
              y: ys,
              type: 'bar',
              marker: { color: '#3B82F6' },
              name: 'Poisson PMF'
            }
          : {
              x: xs,
              y: ys,
              mode: 'lines',
              type: 'scatter',
              line: { color: '#3B82F6', width: 3 },
              name: 'Function'
            }
      ]

      const layout = {
        title: 'Dynamic Graphs',
        xaxis: { title: 'x', range: [xmin, xmax] },
        yaxis: { title: 'y', automargin: true },
        margin: { l: 60, r: 20, t: 40, b: 60 }
      }

      if (plotlyGraph.value) {
        Plotly.newPlot(plotlyGraph.value, data, layout, { responsive: true })
      }
    }

    const update = () => {
      const { xmin, xmax, points } = domain.value
      const xs = selectedFunction.value === 'poisson' ? Array.from({ length: points }, (_, i) => i) : generateX(xmin, xmax, points)
      const ys = computeY(xs)

      const trace = selectedFunction.value === 'poisson'
        ? { x: xs, y: ys, type: 'bar', marker: { color: '#3B82F6' }, name: 'Poisson PMF' }
        : { x: xs, y: ys, mode: 'lines', type: 'scatter', line: { color: '#3B82F6', width: 3 }, name: 'Function' }

      if (plotlyGraph.value) {
        Plotly.react(
          plotlyGraph.value,
          [trace],
          {
            title: 'Dynamic Graphs',
            xaxis: { title: 'x', range: [xmin, xmax] },
            yaxis: { title: 'y', automargin: true },
            margin: { l: 60, r: 20, t: 40, b: 60 }
          },
          { responsive: true }
        )
      }
    }

    watch([selectedFunction], () => update())
    watch(params, () => update(), { deep: true })

    onMounted(() => {
      nextTick(() => draw())
    })

    return {
      plotlyGraph,
      functionOptions,
      selectedFunction,
      params,
      visibleParams,
      currentFormula,
      formatParamValue,
      showSliderSettings,
      ensureMinBeforeMax,
      paramEffect
    }
  }
}
</script>

<style scoped>
.dynamic-graphs-container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  height: 95vh;
  gap: 20px;
  overflow-x: hidden;
  padding-left: 80px;
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


