import visjs from 'viz.js'
import ramda from 'ramda'
import k8sDotGraph from 'k8s-dot-graph'

window.onload = init

const apiV1Url = '/api/v1'
const apiV1Beta1Url = '/apis/extensions/v1beta1'

const graphId = 'graph'
const errorId = 'error'
const saveSvgId = 'saveSvg'
const saveDotId = 'saveDot'

/*
// cluster: by pod/deployment metadata.generateName, node spec.nodeName
 */
function init() {

  const p1 = getNodeSpecsP(apiV1Url)
  const p2 = getServiceSpecsP(apiV1Url)
  const p3 = getPodSpecsP(apiV1Url)
  const p4 = getIngressSpecsP(apiV1Beta1Url)

  Promise.all([p1, p2, p3, p4])
  .then(([nodeList, serviceList, podList, ingressList]) => {

    const dotGraphString = k8sDotGraph.makeDotGraph({nodeList, serviceList, podList, ingressList})
    const svgString = generateSvg(dotGraphString)

    const graph = document.getElementById(graphId)
    graph.innerHTML = svgString

    const svgElement = graph.firstElementChild
    svgElement.setAttribute('id', 'k8sSvg')

    allowSvgSave(svgString)
    allowDotSave(dotGraphString)
  })
  .catch((err) => {
    const errDiv = document.getElementById(errorId)
    errDiv.innerHTML = err
  })
}

function allowSvgSave(svgString) {
  const saveSvg = document.getElementById(saveSvgId)
  saveSvg.onclick = function(e) {
    browserDownloadFile(svgString, 'image/svg+xml', 'kube-cluster.svg')
  }
  saveSvg.style.display = "inline"
}

function allowDotSave(dotString) {
  const saveDot = document.getElementById(saveDotId)
  saveDot.onclick = function(e) {
    browserDownloadFile(dotString, 'text/vnd.graphviz', 'kube-cluster.dot')
  }
  saveDot.style.display = "inline"
}

function browserDownloadFile(string, mimetype, filename) {

  const fileBlob = new Blob(
    [string],
    {
      'type': mimetype,
      'Content-Disposition': `attachment; filename="${filename}"`,
    }
  )

  const url = URL.createObjectURL(fileBlob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function generateSvg(dotGraphString) {
  const svg = visjs(dotGraphString)
  return svg
}

function getServiceSpecsP(baseApiUrl) {
  return getKubeObjSpecP(baseApiUrl, 'services')
}

function getIngressSpecsP(baseApiUrl) {
  return getKubeObjSpecP(baseApiUrl, 'ingresses')
}

function getPodSpecsP(baseApiUrl) {
  return getKubeObjSpecP(baseApiUrl, 'pods')
}

function getNodeSpecsP(baseApiUrl) {
  return getKubeObjSpecP(baseApiUrl, 'nodes', false)
}

function getKubeObjSpecP(baseApiUrl, type, namespace = 'default') {

  let url = `${baseApiUrl}/${type}`

  if (namespace) {
    url = `${baseApiUrl}/namespaces/${namespace}/${type}`
  }

  return fetch(url).then(res => {
    return res.json()
  }).then((obj) => {
    return obj.items
  })
}
