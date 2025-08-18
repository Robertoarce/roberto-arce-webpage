<template>
  <div class="linear-regression-container bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-10">
    <div class="graph-display-section bg-white dark:bg-gray-800 shadow-lg rounded-lg flex flex-col items-center justify-center">
      <div ref="plotlyGraph" class="plotly-graph"></div>
      <h2 class="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300">Graph Display</h2>
      <div class="graph-options mb-4 w-full px-4">
        <label for="graph-type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Graph Type:</label>
        <select id="graph-type" v-model="selectedGraphType" @change="updateGraph" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
          <option value="2d_pca">2D PCA</option>
          <option value="3d_selected">3D Selected Columns vs Target</option>
          <option value="2d_selected">2D Selected Columns vs Target</option>
          <option value="2d_all">2D All Columns vs Target</option>
        </select>
        <!-- 2D feature selection buttons, only visible if 2d_selected is chosen -->
        <div v-if="selectedGraphType === '2d_selected'" class="mt-2 flex space-x-2">
          <button @click="selectFeatureFor2D('m2')" :class="{'bg-blue-700': selectedFeatures[0] === 'm2', 'bg-blue-500': selectedFeatures[0] !== 'm2'}" class="text-white font-bold py-2 px-4 rounded-md shadow-md">2D Plot: m2</button>
          <button @click="selectFeatureFor2D('district')" :class="{'bg-blue-700': selectedFeatures[0] === 'district', 'bg-blue-500': selectedFeatures[0] !== 'district'}" class="text-white font-bold py-2 px-4 rounded-md shadow-md">2D Plot: district</button>
        </div>
      </div>
    </div>
    <div class="data-input-section bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 class="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300">Data Input</h2>
      <!-- Removed Add/Remove Column Buttons -->
      <div class="mb-4">
        <label for="data-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paste CSV Data Here:</label>
        <textarea id="data-input" v-model="csvInput" rows="6" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        <button @click="importData" class="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md">Import Data</button>
      </div>
      <table class="data-table w-full border-collapse rounded-lg overflow-hidden shadow-md">
        <thead>
          <tr class="bg-blue-600 text-white">
            <th v-for="(col, index) in columns" :key="col" class="py-3 px-4 uppercase font-semibold text-sm">
              <input
                v-model="columns[index]"
                @blur="updateColumnName(index, $event.target.value)"
                @keyup.enter="$event.target.blur()"
                class="bg-transparent border-none text-white text-center font-semibold uppercase focus:outline-none"
                :disabled="col === 'Target'" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in tableData" :key="rowIndex" class="border-b border-gray-200 dark:border-gray-700">
            <td v-for="(col, colIndex) in columns" :key="colIndex" class="py-3 px-4">
              <input v-model="row[col]" type="number" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="mt-4 flex space-x-2">
        <button @click="addRow" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md shadow-md">Add Row</button>
        <button @click="fitRegression" class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md shadow-md">Fit Regression</button>
        <button @click="updateGraph" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md shadow-md">Apply Changes to Graph</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import Plotly from 'plotly.js-dist-min'
import { Matrix } from 'ml-matrix'
import { PCA } from 'ml-pca'
import { SimpleLinearRegression } from 'ml-regression-simple-linear'

export default {
  name: 'LinearRegression',
  setup() {
    const plotlyGraph = ref(null)
    const columns = ref(['Target', 'm2', 'district'])
    const tableData = ref([
      { Target: 1990000, m2: 104, district: 3 },
      { Target: 1236000, m2: 134, district: 10 },
      { Target: 416500, m2: 31, district: 6 },
      { Target: 313500, m2: 38, district: 10 },
      { Target: 1500000, m2: 105, district: 9 },
      { Target: 330000, m2: 30, district: 10 },
      { Target: 620000, m2: 4, district: 6 },
      { Target: 259000, m2: 16, district: 6 },
      { Target: 145000, m2: 15, district: 10 },
      { Target: 1050000, m2: 84, district: 7 },
    ])
    
    const csvInput = ref(`price,m2,district
2990000,162,5
1236000,134,10
540000,53,2
995000,90,3
249000,15,3
300700,65,5
826250,111,6
400000,56,6
205250,35,7
147620,17,4
800000,63,4
415000,52,5
139500,10,3
1668000,161,10
360000,25,4
1182000,98,9
300700,65,5
495000,31,3
85000,7,4
468000,33,8
850000,71,3
350000,35,10
675000,51,6
735000,105,10
250000,21,5
51000,12,9
1236000,134,10
245000,24,5
59900,6,9
740000,80,10
499000,51,10
600000,40,5
540000,65,10
135000,9,7
700000,73,8
489000,47,10
15000,14,19
220000,24,16
545000,38,6
29500,12,18
725000,65,15
230000,26,18
259800,31,12
1600000,118,8
325000,32,14
235000,23,15
286200,34,18
85000,6,15
19000,6,5
238000,24,17
249000,17,17
170000,16,11
999000,95,15
2950000,194,13
1477142,157,11
1150000,98,9
102000,9,16
275000,34,19
1990000,104,3
1236000,134,10
416500,31,6
313500,38,10
1500000,105,9
330000,30,10
620000,4,6
259000,16,6
145000,15,10
1050000,84,7
375000,39,10
550000,41,9
1150000,90,5
55000,5,10
550000,43,4
180000,14,5
310000,16,6
945000,66,3
2400000,126,7
665600,46,7
225000,13,7
340000,30,5
450000,35,6
525000,77,10
807000,73,10
325000,23,5
550000,53,3
1450000,135,9
310000,40,10
1300000,139,10
86000,10,9
1990000,104,3
1236000,134,10
416500,31,6
313500,38,10
1500000,105,9
330000,30,10
620000,4,6
259000,16,6
145000,15,10
1050000,84,7
375000,39,10
550000,41,9
1150000,90,5
55000,5,10
550000,43,4
180000,14,5
310000,16,6
945000,66,3
2400000,126,7
665600,46,7
225000,13,7
340000,30,5
450000,35,6
525000,77,10
807000,73,10
325000,23,5
550000,53,3
1450000,135,9
310000,40,10
1300000,139,10
86000,10,9
1990000,104,3
1236000,134,10
416500,31,6
313500,38,10
1500000,105,9
330000,30,10
620000,4,6
259000,16,6
145000,15,10
1050000,84,7
375000,39,10
550000,41,9
1150000,90,5
55000,5,10
550000,43,4
180000,14,5
310000,16,6
945000,66,3
2400000,126,7
665600,46,7
225000,13,7
340000,30,5
450000,35,6
525000,77,10
807000,73,10
325000,23,5
550000,53,3
1450000,135,9
310000,40,10
1300000,139,10
86000,10,9
1990000,104,3
1236000,134,10
416500,31,6
313500,38,10
1500000,105,9
330000,30,10
620000,4,6
259000,16,6
145000,15,10
1050000,84,7
375000,39,10
550000,41,9
1150000,90,5
55000,5,10
679000,67,9
450000,40,10
699000,47,7
330000,22,6
2200000,123,7
800000,60,9
1090000,77,6
450000,35,6
525000,77,10
807000,73,10
325000,23,5
550000,53,3
1450000,135,9
310000,40,10
1300000,139,10
86000,10,9
1050000,84,7
375000,39,10
550000,41,9
1150000,90,5
55000,5,10
679000,67,9
450000,40,10
699000,47,7
330000,22,6
2200000,123,7
800000,60,9
1090000,77,6
450000,35,6
525000,77,10
807000,73,10
325000,23,5
550000,53,3
1450000,135,9
310000,40,10
1300000,139,10
86000,10,9
1050000,84,7
375000,39,10
550000,41,9
1150000,90,5
55000,5,10
679000,67,9
450000,40,10
699000,47,7
330000,22,6
2200000,123,7
800000,60,9
1090000,77,6
450000,35,6
525000,77,10
807000,73,10
325000,23,5
550000,53,3
1450000,135,9
310000,40,10
1300000,139,10
86000,10,9
1050000,84,7
375000,39,10
550000,41,9
1150000,90,5
55000,5,10
679000,67,9
450000,40,10
699000,47,7
330000,22,6
2200000,123,7
800000,60,9
1090000,77,6
450000,35,6
525000,77,10
807000,73,10
325000,23,5
550000,53,3
1450000,135,9
310000,40,10
1300000,139,10
86000,10,9
1990000,104,3
1236000,134,10
416500,31,6
313500,38,10
1500000,105,9
330000,30,10
620000,4,6
259000,16,6
145000,15,10
1050000,84,7
375000,39,10
550000,41,9
1150000,90,5
55000,5,10
550000,43,4
180000,14,5
310000,16,6
945000,66,3
2400000,126,7
665600,46,7
225000,13,7
340000,30,5
450000,35,6
525000,77,10
807000,73,10
325000,23,5
550000,53,3
1450000,135,9
310000,40,10
1300000,139,10
86000,10,9`)

    const plotData = ref([])
    const plotLayout = ref({})
    const selectedGraphType = ref('2d_selected')
    const selectedFeatures = ref(['m2'])
    const regressionModel = ref(null)

    // Color palette for districts (1-20)
    const districtColors = {
      1: '#FF6B6B',   // Red
      2: '#4ECDC4',   // Teal
      3: '#45B7D1',   // Blue
      4: '#96CEB4',   // Green
      5: '#FFEAA7',   // Yellow
      6: '#DDA0DD',   // Plum
      7: '#98D8C8',   // Mint
      8: '#F7DC6F',   // Light Yellow
      9: '#BB8FCE',   // Light Purple
      10: '#85C1E9',  // Light Blue
      11: '#F8C471',  // Orange
      12: '#82E0AA',  // Light Green
      13: '#F1948A',  // Light Red
      14: '#76D7C4',  // Aqua
      15: '#AED6F1',  // Sky Blue
      16: '#A9DFBF',  // Sage Green
      17: '#F9E79F',  // Pale Yellow
      18: '#D2B4DE',  // Lavender
      19: '#A3E4D7',  // Seafoam
      20: '#FAD7A0'   // Peach
    }

    const getDistrictColor = (district) => {
      return districtColors[district] || '#808080' // Default gray for unknown districts
    }

    const addRow = () => {
      const newRow = {}
      columns.value.forEach(col => {
        newRow[col] = 0
      })
      tableData.value.push(newRow)
    }

    const importData = () => {
      if (!csvInput.value) {
        alert("Please paste CSV data into the textarea.")
        return
      }

      const parsedData = parseCsvData(csvInput.value)
      if (parsedData.tableData.length === 0) {
        alert("No valid data rows could be imported.")
        return
      }
      columns.value = parsedData.columns
      tableData.value = parsedData.tableData

      if (columns.value.includes('m2')) {
        selectedFeatures.value = ['m2']
      } else if (columns.value.includes('district')) {
        selectedFeatures.value = ['district']
      } else {
        selectedFeatures.value = []
      }
      updateGraph()
    }

    const parseCsvData = (csvString) => {
      const lines = csvString.trim().split('\n')
      if (lines.length < 2) {
        alert("Please provide at least a header row and one data row.")
        return { columns: [], tableData: [] }
      }

      const newColumns = lines[0].split(',').map(col => col.trim().replace(/^"|"$/g, ''))
      let newTableData = []

      if (!newColumns.includes('price') || !newColumns.includes('m2') || !newColumns.includes('district')) {
        alert("CSV must contain 'price', 'm2', and 'district' columns.")
        return { columns: [], tableData: [] }
      }

      const mappedColumns = newColumns.map(col => (col === 'price' ? 'Target' : col))

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(val => val.trim().replace(/^"|"$/g, ''))
        if (values.length !== newColumns.length) {
          alert(`Row ${i + 1} has an incorrect number of values. Skipping row.`)
          continue
        }

        const rowData = {}
        let isValidRow = true
        for (let j = 0; j < newColumns.length; j++) {
          const colName = mappedColumns[j]
          const value = parseFloat(values[j])
          if (isNaN(value)) {
            alert(`Invalid number in row ${i + 1}, column ${newColumns[j]}. Skipping row.`)
            isValidRow = false
            break
          }
          rowData[colName] = value
        }

        if (isValidRow) {
          newTableData.push(rowData)
        }
      }
      return { columns: mappedColumns, tableData: newTableData }
    }

    const updateColumnName = (index, newName) => {
      const oldName = columns.value[index]
      if (oldName === 'Target') return

      if (!newName || columns.value.filter((col, i) => col === newName && i !== index).length > 0) {
        alert("Column name must be unique and not empty.")
        columns.value[index] = oldName
        return
      }

      tableData.value.forEach(row => {
        if (row.hasOwnProperty(oldName)) {
          row[newName] = row[oldName]
          delete row[oldName]
        }
      })

      selectedFeatures.value = selectedFeatures.value.map(f => (f === oldName ? newName : f))
      columns.value[index] = newName
    }

    const addPointFromGraph = (eventData) => {
      if (!eventData || !eventData.points || eventData.points.length === 0) return

      const newRow = {}
      let isValidClick = false

      if (selectedGraphType.value === '2d_selected') {
        if (eventData.points[0].x !== undefined && eventData.points[0].y !== undefined) {
          newRow[selectedFeatures.value[0]] = eventData.points[0].x
          newRow['Target'] = eventData.points[0].y
          columns.value.filter(col => col !== selectedFeatures.value[0] && col !== 'Target').forEach(col => {
            newRow[col] = 0
          })
          isValidClick = true
        }
      } else if (selectedGraphType.value === '3d_selected') {
        if (eventData.points[0].x !== undefined && eventData.points[0].y !== undefined && eventData.points[0].z !== undefined) {
          newRow[selectedFeatures.value[0]] = eventData.points[0].x
          newRow[selectedFeatures.value[1]] = eventData.points[0].y
          newRow['Target'] = eventData.points[0].z
          columns.value.filter(col => col !== selectedFeatures.value[0] && col !== selectedFeatures.value[1] && col !== 'Target').forEach(col => {
            newRow[col] = 0
          })
          isValidClick = true
        }
      } else {
        alert("Adding points by clicking on the graph is only supported for '2D Selected Columns vs Target' and '3D Selected Columns vs Target' graph types.")
      }

      if (isValidClick) {
        tableData.value.push(newRow)
      }
    }

    const fitRegression = () => {
      console.log('Fitting regression with data:', tableData.value)

      if (tableData.value.length === 0) {
        alert("Please add some data to fit the regression.")
        return
      }

      const x = tableData.value.map(row => row[selectedFeatures.value[0]])
      const y = tableData.value.map(row => row.Target)

      if (x.length !== y.length || x.length < 2) {
        alert("Not enough data or mismatch in data for regression. Need at least 2 data points for a single feature.")
        return
      }

      try {
        regressionModel.value = new SimpleLinearRegression(x, y)
        console.log('Regression Model Parameters:', regressionModel.value.weights)
        updateGraph()
      } catch (error) {
        alert("Error fitting regression: " + error.message)
        console.error("Error fitting regression:", error)
      }
    }

    const selectFeatureFor2D = (featureName) => {
      selectedGraphType.value = '2d_selected'
      selectedFeatures.value = [featureName]
      updateGraph()
    }

    const updateGraph = () => {
      plotData.value = []
      plotLayout.value = {}

      const targetColumn = 'Target'

      switch (selectedGraphType.value) {
        case '2d_pca':
          if (tableData.value.length === 0) {
            alert("Please add some data for PCA calculation.")
            return
          }
          try {
            const featureData = tableData.value.map(row =>
              columns.value.filter(col => col !== targetColumn).map(col => row[col])
            )
            console.log("Feature Data for PCA:", featureData)
            const pca = new PCA(new Matrix(featureData))
            console.log("PCA object:", pca)
            const transformedData = pca.predict(featureData).to2DArray()
            const x = transformedData.map(row => row[0])
            const y = transformedData.map(row => row[1])

            plotData.value = [
              {
                x: x,
                y: y,
                mode: 'markers',
                type: 'scatter',
              },
            ]

            plotLayout.value = {
              title: '2D PCA of Data',
              xaxis: { title: 'Principal Component 1' },
              yaxis: { title: 'Principal Component 2' },
            }
          } catch (error) {
            alert("Error performing PCA: " + error.message)
            console.error("Error performing PCA:", error)
          }
          break
        case '3d_selected':
          if (!(selectedFeatures.value[0] === 'm2' && selectedFeatures.value[1] === 'district')) {
            selectedFeatures.value = ['m2', 'district']
          }
          {
            const x = tableData.value.map(row => row[selectedFeatures.value[0]])
            const y = tableData.value.map(row => row[selectedFeatures.value[1]])
            const z = tableData.value.map(row => row[targetColumn])
            const districts = tableData.value.map(row => row.district)
            const colors = districts.map(district => getDistrictColor(district))

            plotData.value = [
              {
                x: x,
                y: y,
                z: z,
                mode: 'markers',
                type: 'scatter3d',
                marker: {
                  color: colors,
                  size: 8,
                  opacity: 0.8,
                  line: {
                    color: 'rgba(0,0,0,0.3)',
                    width: 1
                  }
                },
                text: districts.map(district => `District: ${district}`),
                hovertemplate: 
                  '<b>M2:</b> %{x}<br>' +
                  '<b>District:</b> %{y}<br>' +
                  '<b>Price:</b> %{z}<br>' +
                  '%{text}<extra></extra>'
              },
            ]

            plotLayout.value = {
              title: 'Selected Features vs Target (3D) - Colored by District',
              scene: {
                xaxis: { title: 'M2' },
                yaxis: { title: 'District' },
                zaxis: { title: 'Price' },
              },
            }
          }
          break
        case '2d_selected':
          if (!selectedFeatures.value || selectedFeatures.value.length === 0 || !(columns.value.includes(selectedFeatures.value[0]) && selectedFeatures.value[0] !== targetColumn)) {
            if (columns.value.includes('m2')) {
              selectedFeatures.value = ['m2']
            } else if (columns.value.includes('district')) {
              selectedFeatures.value = ['district']
            } else {
              alert("No valid feature columns (m2 or district) available for 2D plot.")
              return
            }
          }
          {
            const x = tableData.value.map(row => row[selectedFeatures.value[0]])
            const y = tableData.value.map(row => row[targetColumn])

            plotData.value = [
              {
                x: x,
                y: y,
                mode: 'markers',
                type: 'scatter',
              },
            ]

            const regressionXCol = columns.value.filter(col => col !== targetColumn)[0]
            if (regressionModel.value && selectedFeatures.value[0] === regressionXCol) {
              const xMin = Math.min(...x)
              const xMax = Math.max(...x)
              const regressionLineX = [xMin, xMax]
              const regressionLineY = regressionLineX.map(val => regressionModel.value.predict(val))

              plotData.value.push({
                x: regressionLineX,
                y: regressionLineY,
                mode: 'lines',
                type: 'scatter',
                name: 'Regression Line',
              })
            }

            plotLayout.value = {
              title: 'Selected Feature vs Target',
              xaxis: { title: selectedFeatures.value[0] },
              yaxis: { title: 'Price' },
            }
          }
          break
        case '2d_all':
          {
            const features = columns.value.filter(col => col !== targetColumn)
            plotData.value = features.map(feature => ({
              x: tableData.value.map(row => row[feature]),
              y: tableData.value.map(row => row[targetColumn]),
              mode: 'markers',
              type: 'scatter',
              name: feature,
            }))

            plotLayout.value = {
              title: 'All Features vs Target',
              xaxis: { title: 'Feature Value' },
              yaxis: { title: 'Price' },
            }
          }
          break
        default:
          break
      }

      console.log("Plot Data:", plotData.value)
      console.log("Plot Layout:", plotLayout.value)
      
      nextTick(() => {
        if (plotlyGraph.value) {
          Plotly.newPlot(plotlyGraph.value, plotData.value, plotLayout.value)
        }
      })
    }

    onMounted(() => {
      const initialLines = csvInput.value.trim().split('\n')
      const header = initialLines[0]
      const dataRows = initialLines.slice(1, 11)

      const parsedInitialData = parseCsvData([header, ...dataRows].join('\n'))
      columns.value = parsedInitialData.columns
      tableData.value = parsedInitialData.tableData

      if (columns.value.includes('m2')) {
        selectedFeatures.value = ['m2']
      } else if (columns.value.includes('district')) {
        selectedFeatures.value = ['district']
      } else {
        selectedFeatures.value = []
      }

      nextTick(() => {
        updateGraph()
        if (plotlyGraph.value) {
          plotlyGraph.value.on('plotly_click', addPointFromGraph)
        }
      })
    })

    onBeforeUnmount(() => {
      if (plotlyGraph.value) {
        plotlyGraph.value.removeAllListeners('plotly_click')
      }
    })

    watch(selectedGraphType, () => {
      updateGraph()
    })

    return {
      plotlyGraph,
      columns,
      tableData,
      csvInput,
      plotData,
      plotLayout,
      selectedGraphType,
      selectedFeatures,
      regressionModel,
      addRow,
      importData,
      updateColumnName,
      fitRegression,
      selectFeatureFor2D,
      updateGraph
    }
  }
}
</script>

<style scoped>
.linear-regression-container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  height: 95vh;
  gap: 20px;
  overflow-x: hidden;
}

.data-input-section {
  flex: 1;
  padding: 20px;
  overflow: auto;
  overflow-x: hidden;
}

.graph-display-section {
  flex: 1;
  padding: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.data-table th,
.data-table td {
  text-align: left;
}

.data-table thead th:first-child {
  border-top-left-radius: 8px;
}

.data-table thead th:last-child {
  border-top-right-radius: 8px;
}

.data-table tbody tr:last-child td:first-child {
  border-bottom-left-radius: 8px;
}

.data-table tbody tr:last-child td:last-child {
  border-bottom-right-radius: 8px;
}

.plotly-graph {
  width: 100%;
  height: 80%;
}
</style>