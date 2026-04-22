(function () {
  var AGENTS = [
    { id: 'a1', label: 'squad-conteudo', tasks: ['escrevendo roteiro', 'criando post', 'editando copy', 'gerando thumbnail'] },
    { id: 'a2', label: 'squad-vendas', tasks: ['qualificando lead', 'redigindo follow-up', 'agendando reuniao', 'atualizando pipeline'] },
    { id: 'a3', label: 'squad-entrega', tasks: ['enviando onboarding', 'monitorando churn', 'sincronizando ChatFunnel', 'atualizando docs'] },
    { id: 'a4', label: 'squad-gestao', tasks: ['atualizando dashboard', 'gerando relatorio KPI', 'checando alertas', 'conferindo receita'] },
    { id: 'a5', label: 'squad-pesquisa', tasks: ['coletando tendencias', 'analisando concorrentes', 'transcrevendo aulas', 'resumindo mercado'] },
    { id: 'a6', label: 'squad-midia', tasks: ['otimizando anuncio', 'testando variacoes', 'escrevendo briefing', 'alocando verba'] },
    { id: 'a7', label: 'squad-suporte', tasks: ['respondendo cliente', 'triando ticket', 'atualizando FAQ', 'sincronizando inbox'] },
    { id: 'a8', label: 'squad-email', tasks: ['disparando sequencia', 'segmentando lista', 'testando assunto', 'revisando template'] },
    { id: 'a9', label: 'squad-analytics', tasks: ['calculando KPIs', 'gerando insight', 'exportando relatorio', 'validando dados'] },
    { id: 'a10', label: 'squad-criativos', tasks: ['gerando variacao', 'ajustando thumbnail', 'criando story', 'revisando post'] },
  ];

  var ICON_IDLE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12" aria-hidden="true"><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>';
  var ICON_RUNNING = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="12" height="12" aria-hidden="true" style="animation:spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>';
  var ICON_DONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="12" height="12" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';

  function createTile(agent, seed) {
    var el = document.createElement('div');
    el.className = 'agent-tile';
    el.dataset.status = 'idle';
    el.setAttribute('role', 'listitem');
    el.innerHTML =
      '<div class="agent-tile__top">' +
      '<div class="agent-tile__left">' +
      '<span class="agent-tile__dot" aria-hidden="true"></span>' +
      '<span class="agent-tile__label">' + agent.label + '</span>' +
      '</div>' +
      '<span class="agent-tile__icon">' + ICON_IDLE + '</span>' +
      '</div>' +
      '<div class="agent-tile__bottom">' +
      '<span class="agent-tile__prompt">$</span>' +
      '<span class="agent-tile__task" data-task></span>' +
      '</div>';

    var taskSpan = el.querySelector('[data-task]');
    var iconSpan = el.querySelector('.agent-tile__icon');
    var taskIndex = seed % agent.tasks.length;
    var mounted = true;
    var timers = [];

    function renderTask() {
      taskSpan.innerHTML = '';
      var label = document.createElement('span');
      label.textContent = agent.tasks[taskIndex];
      taskSpan.appendChild(label);

      if (el.dataset.status === 'running') {
        var cursor = document.createElement('span');
        cursor.className = 'agent-tile__task-cursor';
        taskSpan.appendChild(cursor);
      } else if (el.dataset.status === 'done') {
        var check = document.createElement('span');
        check.className = 'agent-tile__task-check';
        check.textContent = '✓';
        taskSpan.appendChild(check);
      }
    }

    function setStatus(status) {
      el.dataset.status = status;
      if (status === 'running') iconSpan.innerHTML = ICON_RUNNING;
      else if (status === 'done') iconSpan.innerHTML = ICON_DONE;
      else iconSpan.innerHTML = ICON_IDLE;
      renderTask();
    }

    function step() {
      if (!mounted) return;
      timers.push(setTimeout(function () {
        if (!mounted) return;
        setStatus('running');
        timers.push(setTimeout(function () {
          if (!mounted) return;
          setStatus('done');
          timers.push(setTimeout(function () {
            if (!mounted) return;
            taskIndex = (taskIndex + 1) % agent.tasks.length;
            setStatus('idle');
            timers.push(setTimeout(step, 400 + (seed % 3) * 120));
          }, 650));
        }, 1900 + (seed % 5) * 160));
      }, 280));
    }

    setStatus('idle');
    timers.push(setTimeout(step, seed * 430));

    el.dispose = function () {
      mounted = false;
      timers.forEach(clearTimeout);
    };

    return el;
  }

  function mount() {
    var grid = document.getElementById('agent-swarm');
    if (!grid) return;
    var tiles = AGENTS.map(function (agent, idx) {
      var tile = createTile(agent, idx + 1);
      grid.appendChild(tile);
      return tile;
    });

    if (typeof window.gsap !== 'undefined') {
      window.gsap.from(tiles, {
        opacity: 0,
        y: 16,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.2,
      });
    }

    var counter = document.getElementById('swarm-task-count');
    if (!counter) return;

    if (typeof window.gsap !== 'undefined') {
      var obj = { value: 142 };
      setInterval(function () {
        var next = obj.value + Math.floor(1 + Math.random() * 3);
        window.gsap.to(obj, {
          value: next,
          duration: 0.7,
          ease: 'power1.out',
          onUpdate: function () {
            counter.textContent = Math.round(obj.value);
          },
        });
      }, 1600);
    } else {
      var count = 142;
      setInterval(function () {
        count += Math.floor(1 + Math.random() * 3);
        counter.textContent = count;
      }, 1600);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
