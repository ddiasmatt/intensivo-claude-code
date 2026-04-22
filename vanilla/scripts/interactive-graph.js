(function () {
  var VIEWBOX_W = 620;
  var VIEWBOX_H = 460;
  var CX = VIEWBOX_W / 2;
  var CY = VIEWBOX_H / 2;
  var HUB_RADIUS = 150;
  var LEAF_RADIUS = 85;
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function motion(amp) {
    return {
      phaseX: rand(0, Math.PI * 2),
      phaseY: rand(0, Math.PI * 2),
      freqX: rand(0.35, 0.7),
      freqY: rand(0.35, 0.7),
      amp: amp,
    };
  }

  function buildGraph() {
    var hubs = [
      { label: 'Conteudo', angle: 210 },
      { label: 'Vendas', angle: 330 },
      { label: 'Entrega', angle: 150 },
      { label: 'Gestao', angle: 30 },
    ];
    var leavesPerHub = {
      Conteudo: ['Roteiros', 'Posts', 'Copy ads'],
      Vendas: ['Leads', 'Follow-up', 'Pipeline'],
      Entrega: ['Onboarding', 'ChatFunnel', 'Atendimento'],
      Gestao: ['Dashboards', 'KPIs', 'Alertas'],
    };

    var nodes = [];
    var edges = [];

    // Center
    var centerMotion = motion(3);
    nodes.push(Object.assign({
      id: 'center', bx: CX, by: CY, r: 24, label: 'VOCE', type: 'center',
      labelOffset: [0, 5], labelAnchor: 'middle',
    }, centerMotion));

    // Hubs
    hubs.forEach(function (h, i) {
      var rad = (h.angle * Math.PI) / 180;
      var hubMotion = motion(9);
      nodes.push(Object.assign({
        id: 'hub-' + i,
        bx: CX + HUB_RADIUS * Math.cos(rad),
        by: CY + HUB_RADIUS * Math.sin(rad),
        r: 10, label: h.label, type: 'hub',
        labelOffset: [0, -16], labelAnchor: 'middle',
      }, hubMotion));
    });

    // Leaves
    hubs.forEach(function (h, hi) {
      var hubIdx = hi + 1;
      var leaves = leavesPerHub[h.label];
      var hubAngle = h.angle;
      var hubRad = (hubAngle * Math.PI) / 180;
      var hubX = CX + HUB_RADIUS * Math.cos(hubRad);
      var hubY = CY + HUB_RADIUS * Math.sin(hubRad);

      leaves.forEach(function (leafLabel, li) {
        var baseAngle = hubAngle + (li - 1) * 28;
        var rad = (baseAngle * Math.PI) / 180;
        var lx = hubX + LEAF_RADIUS * Math.cos(rad);
        var ly = hubY + LEAF_RADIUS * Math.sin(rad);
        var isLeftSide = lx < CX;
        var leafMotion = motion(14);

        nodes.push(Object.assign({
          id: 'leaf-' + hi + '-' + li,
          bx: lx, by: ly, r: 4.5,
          label: leafLabel, type: 'leaf',
          labelOffset: [isLeftSide ? -9 : 9, 4],
          labelAnchor: isLeftSide ? 'end' : 'start',
        }, leafMotion));

        edges.push({ from: hubIdx, to: nodes.length - 1, opacity: 0.4 });
      });
      edges.push({ from: 0, to: hubIdx, opacity: 0.55 });
    });

    edges.push({ from: 1, to: 2, opacity: 0.14 });
    edges.push({ from: 3, to: 4, opacity: 0.14 });
    edges.push({ from: 1, to: 3, opacity: 0.1 });
    edges.push({ from: 2, to: 4, opacity: 0.1 });

    return { nodes: nodes, edges: edges };
  }

  function createSvg(graph) {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + VIEWBOX_W + ' ' + VIEWBOX_H);
    svg.setAttribute('class', 'graph');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-labelledby', 'usecases-graph-title');

    var title = document.createElementNS(SVG_NS, 'title');
    title.setAttribute('id', 'usecases-graph-title');
    title.textContent = 'Grafo interativo conectando VOCE as 4 frentes da operacao.';
    svg.appendChild(title);

    // Defs
    var defs = document.createElementNS(SVG_NS, 'defs');
    defs.innerHTML =
      '<radialGradient id="graphCenterGlow" cx="50%" cy="50%" r="50%">' +
      '<stop offset="0%" stop-color="#E07A3A" stop-opacity="0.25"/>' +
      '<stop offset="100%" stop-color="#E07A3A" stop-opacity="0"/>' +
      '</radialGradient>' +
      '<radialGradient id="graphHubGlow" cx="50%" cy="50%" r="50%">' +
      '<stop offset="0%" stop-color="#E07A3A" stop-opacity="0.18"/>' +
      '<stop offset="100%" stop-color="#E07A3A" stop-opacity="0"/>' +
      '</radialGradient>';
    svg.appendChild(defs);

    // Center halo
    var halo = document.createElementNS(SVG_NS, 'circle');
    halo.setAttribute('cx', CX);
    halo.setAttribute('cy', CY);
    halo.setAttribute('r', 80);
    halo.setAttribute('fill', 'url(#graphCenterGlow)');
    svg.appendChild(halo);

    // Edges layer
    var edgesGroup = document.createElementNS(SVG_NS, 'g');
    var lineRefs = [];
    graph.edges.forEach(function (edge) {
      var line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', graph.nodes[edge.from].bx);
      line.setAttribute('y1', graph.nodes[edge.from].by);
      line.setAttribute('x2', graph.nodes[edge.to].bx);
      line.setAttribute('y2', graph.nodes[edge.to].by);
      line.setAttribute('stroke', '#C85D25');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('opacity', edge.opacity);
      line.setAttribute('class', 'graph__edge');
      edgesGroup.appendChild(line);
      lineRefs.push(line);
    });
    svg.appendChild(edgesGroup);

    // Nodes layer
    var nodesGroup = document.createElementNS(SVG_NS, 'g');
    var nodeGroups = [];
    graph.nodes.forEach(function (node, i) {
      var g = document.createElementNS(SVG_NS, 'g');
      g.setAttribute('class', 'graph__node');
      g.dataset.idx = i;

      if (node.type !== 'leaf') {
        var haloCircle = document.createElementNS(SVG_NS, 'circle');
        haloCircle.setAttribute('cx', node.bx);
        haloCircle.setAttribute('cy', node.by);
        haloCircle.setAttribute('r', node.r * 2.6);
        haloCircle.setAttribute('fill', 'url(#graphHubGlow)');
        g.appendChild(haloCircle);
      }

      var fill = node.type === 'center' ? '#0D0D0F' : node.type === 'hub' ? '#E07A3A' : '#F59E53';
      var stroke = node.type === 'center' ? '#E07A3A' : node.type === 'hub' ? '#0D0D0F' : 'none';
      var strokeW = node.type === 'center' ? 1.6 : node.type === 'hub' ? 2.5 : 0;
      var circle = document.createElementNS(SVG_NS, 'circle');
      circle.setAttribute('cx', node.bx);
      circle.setAttribute('cy', node.by);
      circle.setAttribute('r', node.r);
      circle.setAttribute('fill', fill);
      if (stroke !== 'none') {
        circle.setAttribute('stroke', stroke);
        circle.setAttribute('stroke-width', strokeW);
      }
      g.appendChild(circle);

      var text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('x', node.bx + node.labelOffset[0]);
      text.setAttribute('y', node.by + node.labelOffset[1]);
      text.setAttribute('text-anchor', node.labelAnchor);
      var labelColor = node.type === 'center' ? '#F59E53' : node.type === 'hub' ? '#F5F5F0' : '#D4D4D2';
      var fontSize = node.type === 'center' ? 11 : node.type === 'hub' ? 13 : 11;
      var fontWeight = node.type === 'leaf' ? 500 : 700;
      text.setAttribute('fill', labelColor);
      text.setAttribute('font-size', fontSize);
      text.setAttribute('font-weight', fontWeight);
      text.setAttribute('font-family', node.type === 'center' ? 'JetBrains Mono, ui-monospace, monospace' : 'Figtree, system-ui, sans-serif');
      if (node.type === 'leaf') {
        text.setAttribute('text-decoration', 'underline');
        text.setAttribute('text-decoration-color', 'rgba(200,93,37,0.3)');
      }
      text.style.pointerEvents = 'none';
      text.textContent = node.label;
      g.appendChild(text);

      g.style.transformBox = 'fill-box';
      g.style.transformOrigin = 'center';

      nodesGroup.appendChild(g);
      nodeGroups.push(g);
    });
    svg.appendChild(nodesGroup);

    return { svg: svg, lineRefs: lineRefs, nodeGroups: nodeGroups };
  }

  function animateEntrance(nodeGroups, lineRefs) {
    if (typeof window.gsap === 'undefined') {
      nodeGroups.forEach(function (g) { g.style.opacity = '1'; });
      lineRefs.forEach(function (line) { line.style.opacity = ''; });
      return;
    }
    var tl = window.gsap.timeline();
    tl.fromTo(
      nodeGroups,
      { opacity: 0, scale: 0.4 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.04,
        ease: 'back.out(1.6)',
        transformOrigin: 'center',
      }
    );
    tl.fromTo(
      lineRefs,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, stagger: 0.02, ease: 'power2.out' },
      '<0.2'
    );
  }

  function hookInteractions(graph, nodeGroups, lineRefs) {
    var hoveredIdx = null;
    var hasGsap = typeof window.gsap !== 'undefined';

    function applyHoverState() {
      nodeGroups.forEach(function (g, i) {
        var connected = hoveredIdx !== null && graph.edges.some(function (e) {
          return (e.from === hoveredIdx || e.to === hoveredIdx) && (e.from === i || e.to === i);
        });
        var isHovered = hoveredIdx === i;
        var dimmed = hoveredIdx !== null && !isHovered && !connected;
        g.classList.toggle('is-dimmed', dimmed);
        var targetScale = isHovered ? 1.35 : 1;
        if (hasGsap) {
          window.gsap.to(g, {
            scale: targetScale,
            duration: 0.3,
            ease: 'power2.out',
            transformOrigin: 'center',
            overwrite: 'auto',
          });
        } else {
          g.style.transform = 'scale(' + targetScale + ')';
        }
      });
      lineRefs.forEach(function (line, i) {
        var e = graph.edges[i];
        var highlighted = hoveredIdx !== null && (e.from === hoveredIdx || e.to === hoveredIdx);
        var dimmed = hoveredIdx !== null && !highlighted;
        line.setAttribute('stroke', highlighted ? '#E07A3A' : '#C85D25');
        line.setAttribute('stroke-width', highlighted ? '1.4' : '1');
        line.setAttribute('opacity', dimmed ? String(e.opacity * 0.25) : String(e.opacity));
      });
    }

    nodeGroups.forEach(function (g, i) {
      g.addEventListener('pointerenter', function () {
        hoveredIdx = i;
        applyHoverState();
      });
      g.addEventListener('pointerleave', function () {
        hoveredIdx = null;
        applyHoverState();
      });
    });
  }

  function animatePositions(graph, nodeGroups, lineRefs) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var startTime = performance.now() / 1000;
    var positions = graph.nodes.map(function (n) {
      return { x: n.bx, y: n.by };
    });
    var useGsap = typeof window.gsap !== 'undefined';

    function tick() {
      var t = performance.now() / 1000 - startTime;

      for (var i = 0; i < graph.nodes.length; i++) {
        var n = graph.nodes[i];
        var p = positions[i];
        p.x = n.bx +
          Math.sin(t * n.freqX + n.phaseX) * n.amp * 0.7 +
          Math.cos(t * n.freqX * 0.5 + n.phaseX * 1.3) * n.amp * 0.3;
        p.y = n.by +
          Math.cos(t * n.freqY + n.phaseY) * n.amp * 0.7 +
          Math.sin(t * n.freqY * 0.5 + n.phaseY * 1.3) * n.amp * 0.3;

        var g = nodeGroups[i];
        if (g) {
          g.setAttribute('transform', 'translate(' + (p.x - n.bx) + ' ' + (p.y - n.by) + ')');
        }
      }

      for (var j = 0; j < graph.edges.length; j++) {
        var e = graph.edges[j];
        var line = lineRefs[j];
        if (!line) continue;
        var a = positions[e.from];
        var b = positions[e.to];
        line.setAttribute('x1', a.x);
        line.setAttribute('y1', a.y);
        line.setAttribute('x2', b.x);
        line.setAttribute('y2', b.y);
      }
    }

    var container = document.getElementById('graph-container');
    if (!container) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        if (useGsap) {
          window.gsap.ticker.add(tick);
        } else {
          (function loop() {
            tick();
            requestAnimationFrame(loop);
          })();
        }
        io.disconnect();
      });
    }, { threshold: 0.1 });
    io.observe(container);
  }

  function mount() {
    var container = document.getElementById('graph-container');
    if (!container) return;

    var graph = buildGraph();
    var rendered = createSvg(graph);
    container.appendChild(rendered.svg);

    animateEntrance(rendered.nodeGroups, rendered.lineRefs);
    hookInteractions(graph, rendered.nodeGroups, rendered.lineRefs);
    animatePositions(graph, rendered.nodeGroups, rendered.lineRefs);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
