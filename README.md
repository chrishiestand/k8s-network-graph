# k8s-network-graph
Nearly bare-bones browser-based kubernetes network graph visualizer. View the network graph in .svg form in the browser. Optionally export a .svg or .dot file.


## Running

1. clone this repository e.g. `git clone git@github.com:chrishiestand/k8s-network-graph.git` and cd into the folder.
2. `npm run-script build`
3. `kubectl proxy --www=dist/`
4. browser to the proxy's host and port appending `/static/` - e.g. <http://127.0.0.1:8001/static/>

## Example
![Example output](https://github.com/chrishiestand/node-k8s-dot-graph/raw/master/test/screenshot.png)

## Future Development

This could be a much nicer web experience.

I tried using [visjs](http://visjs.org/) but it has a couple of serious bugs. If there is interest, (or a PR) then it might be worth getting this working.

1. visjs does not support subgraphs (used for nodes)
 https://github.com/almende/vis/issues/1459

2. visjs draws graph nodes overlapping. A mitigation might be to break up text to multi-lines:
  https://github.com/almende/vis/issues/699

Another option would be rendering with d3.
