(() => {
  'use strict';
  const EX = window.EXERCISES || [];
  const STORAGE_KEY = 'mapreduce_part2_training_v2';
  const LEVELS = {1:'Niveau 1 — Comprendre',2:'Niveau 2 — Appliquer',3:'Niveau 3 — Concevoir',4:'Niveau 4 — Raisonner à l’échelle'};

  const $ = s => document.querySelector(s);
  const els = {
    homeView: $('#homeView'), quizView: $('#quizView'), resultsView: $('#resultsView'),
    startBtn: $('#startBtn'), resumeBtn: $('#resumeBtn'), homeBtn: $('#homeBtn'), reviewBtn: $('#reviewBtn'), resetBtn: $('#resetBtn'),
    globalStats: $('#globalStats'), skillGrid: $('#skillGrid'), progressText: $('#progressText'), progressPct: $('#progressPct'), progressBar: $('#progressBar'),
    levelLabel: $('#levelLabel'), categoryLabel: $('#categoryLabel'), questionNav: $('#questionNav'), exerciseCategory: $('#exerciseCategory'), exerciseState: $('#exerciseState'),
    exerciseTitle: $('#exerciseTitle'), exerciseIntro: $('#exerciseIntro'), exerciseFigure: $('#exerciseFigure'), exerciseImage: $('#exerciseImage'), exercisePrompt: $('#exercisePrompt'),
    answerForm: $('#answerForm'), hintBtn: $('#hintBtn'), checkBtn: $('#checkBtn'), hintBox: $('#hintBox'), feedbackBox: $('#feedbackBox'), solutionBox: $('#solutionBox'),
    prevBtn: $('#prevBtn'), nextBtn: $('#nextBtn'), showSolutionBtn: $('#showSolutionBtn'),
    resultHero: $('#resultHero'), masteredList: $('#masteredList'), reviewList: $('#reviewList'), recommendation: $('#recommendation'), resultsReviewBtn: $('#resultsReviewBtn'), restartBtn: $('#restartBtn')
  };

  const emptyState = () => ({currentId:1, mode:'all', results:{}, answers:{}, hintShown:{}, started:false});
  let state = loadState();
  let pool = EX.map(e => e.id);
  let poolIndex = 0;

  function loadState(){
    try { return {...emptyState(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')}; }
    catch { return emptyState(); }
  }
  function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function normalize(v){
    return String(v ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[()\[\],;:]/g,' ').replace(/\s+/g,' ').trim();
  }
  function matches(input, answers){
    const n = normalize(input);
    return answers.some(a => {
      const e = normalize(a);
      return n === e || (e.length >= 3 && n.includes(e));
    });
  }
  function showView(name){
    [els.homeView,els.quizView,els.resultsView].forEach(v => v.classList.add('hidden'));
    els[name].classList.remove('hidden'); window.scrollTo({top:0,behavior:'smooth'});
  }
  function getResult(id){ return state.results[id] || {status:'todo',attempts:0,solutionViewed:false}; }
  function setResult(id, patch){ state.results[id] = {...getResult(id),...patch}; save(); }
  function currentExercise(){ return EX.find(e => e.id === pool[poolIndex]) || EX[0]; }

  function buildPool(mode='all'){
    state.mode = mode;
    if(mode === 'review'){
      pool = EX.filter(e => getResult(e.id).status === 'incorrect').map(e => e.id);
      if(!pool.length) pool = EX.filter(e => getResult(e.id).status !== 'correct').map(e => e.id);
      if(!pool.length) pool = EX.map(e => e.id);
    } else pool = EX.map(e => e.id);
    poolIndex = Math.max(0, pool.indexOf(state.currentId));
    if(poolIndex < 0) poolIndex = 0;
  }

  function start(mode='all', fromBeginning=false){
    state.started = true;
    if(fromBeginning) state.currentId = mode === 'all' ? 1 : (pool[0] || 1);
    buildPool(mode);
    if(fromBeginning) poolIndex = 0;
    save(); renderExercise(); showView('quizView');
  }

  function renderHome(){
    const answered = EX.filter(e => ['correct','incorrect'].includes(getResult(e.id).status)).length;
    const correct = EX.filter(e => getResult(e.id).status === 'correct').length;
    const incorrect = EX.filter(e => getResult(e.id).status === 'incorrect').length;
    const pct = answered ? Math.round(correct / answered * 100) : 0;
    els.globalStats.innerHTML = `
      <div class="stat"><strong>${answered}/30</strong><span>exercices travaillés</span></div>
      <div class="stat"><strong>${correct}</strong><span>réponses maîtrisées</span></div>
      <div class="stat"><strong>${incorrect}</strong><span>notions à revoir</span></div>
      <div class="stat"><strong>${pct}%</strong><span>réussite sur les exercices tentés</span></div>`;

    const cats = [...new Set(EX.map(e => e.category))];
    els.skillGrid.innerHTML = cats.map(cat => {
      const items = EX.filter(e => e.category === cat);
      const done = items.filter(e => getResult(e.id).status === 'correct').length;
      const p = Math.round(done/items.length*100);
      return `<div class="skill"><div class="skill-head"><strong>${cat}</strong><span>${p}%</span></div><div class="skill-track"><div class="skill-fill" style="width:${p}%"></div></div></div>`;
    }).join('');
    els.resumeBtn.style.display = state.started ? '' : 'none';
  }

  function renderNav(){
    els.questionNav.innerHTML = pool.map((id,i) => {
      const r=getResult(id); const cls=['qnav-btn'];
      if(i===poolIndex) cls.push('current');
      if(r.status!=='todo') cls.push('done',r.status);
      return `<button type="button" class="${cls.join(' ')}" data-id="${id}" aria-label="Exercice ${id}">${id}</button>`;
    }).join('');
    els.questionNav.querySelectorAll('button').forEach(b => b.addEventListener('click',()=>{
      const id=Number(b.dataset.id); poolIndex=pool.indexOf(id); state.currentId=id; save(); renderExercise();
    }));
  }

  function fieldHtml(f, saved=''){
    return `<div class="field-row"><label for="f_${f.id}">${f.label}</label><input id="f_${f.id}" name="${f.id}" value="${escapeHtml(saved)}" placeholder="${escapeHtml(f.placeholder||'')}" autocomplete="off" /></div>`;
  }
  function renderForm(ex){
    const saved = state.answers[ex.id] || {};
    if(ex.type === 'fields') els.answerForm.innerHTML = ex.fields.map(f=>fieldHtml(f,saved[f.id]||'')).join('');
    else if(ex.type === 'numeric') els.answerForm.innerHTML = fieldHtml({id:'numeric',label:'Votre réponse',placeholder:'nombre…'}, saved.numeric||'');
    else if(ex.type === 'mcq') els.answerForm.innerHTML = `<div class="choice-list">${ex.choices.map((c,i)=>`<label class="choice"><input type="radio" name="mcq" value="${i}" ${String(saved.mcq)===String(i)?'checked':''}/><span>${escapeHtml(c)}</span></label>`).join('')}</div>`;
    else if(ex.type === 'open') els.answerForm.innerHTML = `<label for="openAns" class="sr-only">Votre réponse</label><textarea id="openAns" class="open-input" name="open" placeholder="Expliquez votre raisonnement en quelques phrases…">${escapeHtml(saved.open||'')}</textarea>`;
  }

  function renderExercise(){
    const ex = currentExercise(); if(!ex) return;
    state.currentId = ex.id; save();
    const r = getResult(ex.id);
    const pos = poolIndex+1, total=pool.length, pct=Math.round(pos/total*100);
    els.progressText.textContent = state.mode==='review' ? `Révision ${pos} / ${total}` : `Exercice ${ex.id} / 30`;
    els.progressPct.textContent = `${pct}%`; els.progressBar.style.width = `${pct}%`;
    els.levelLabel.textContent = LEVELS[ex.level]; els.categoryLabel.textContent = ex.category;
    els.exerciseCategory.textContent = ex.category; els.exerciseTitle.textContent = ex.title; els.exerciseIntro.textContent = ex.intro || '';
    els.exercisePrompt.textContent = ex.prompt || '';
    els.exerciseState.textContent = r.status === 'correct' ? 'Maîtrisé' : r.status === 'incorrect' ? 'À revoir' : 'À faire';
    if(ex.image){ els.exerciseImage.src=ex.image; els.exerciseImage.alt=`Illustration contextuelle — ${ex.category}`; els.exerciseFigure.classList.remove('hidden'); }
    else els.exerciseFigure.classList.add('hidden');
    renderForm(ex); renderNav();
    els.hintBox.classList.add('hidden'); els.feedbackBox.className='feedback-box hidden'; els.solutionBox.classList.add('hidden');
    els.showSolutionBtn.classList.add('hidden');
    if(r.solutionViewed && r.status === 'incorrect'){
      els.solutionBox.innerHTML=`<strong>Réponse correcte</strong><br>${escapeHtml(ex.solution)}<br><span style="color:var(--muted)">${escapeHtml(ex.explanation)}</span>`;
      els.solutionBox.classList.remove('hidden');
    }
    els.prevBtn.disabled = poolIndex===0; els.nextBtn.textContent = poolIndex===pool.length-1 ? 'Voir mon bilan →' : 'Suivant →';
    if(state.hintShown[ex.id]) showHint();
  }

  function collect(ex){
    const fd = new FormData(els.answerForm), ans={};
    if(ex.type==='fields') ex.fields.forEach(f=>ans[f.id]=fd.get(f.id)||'');
    else if(ex.type==='numeric') ans.numeric=fd.get('numeric')||'';
    else if(ex.type==='mcq') ans.mcq=fd.get('mcq');
    else if(ex.type==='open') ans.open=fd.get('open')||'';
    state.answers[ex.id]=ans; save(); return ans;
  }

  function grade(ex, ans){
    if(ex.type==='fields') return ex.fields.every(f=>matches(ans[f.id],f.answers));
    if(ex.type==='numeric') return Number(String(ans.numeric).replace(',','.'))===Number(ex.answer);
    if(ex.type==='mcq') return Number(ans.mcq)===Number(ex.correct);
    if(ex.type==='open'){
      const n=normalize(ans.open); let groups=0;
      (ex.keywords||[]).forEach(group=>{ if(group.some(k=>n.includes(normalize(k)))) groups++; });
      return groups >= (ex.minGroups||1);
    }
    return false;
  }

  function check(){
    const ex=currentExercise(), ans=collect(ex), ok=grade(ex,ans), prev=getResult(ex.id);
    const attempts=(prev.attempts||0)+1;
    if(ok){
      setResult(ex.id,{status:'correct',attempts,solutionViewed:false});
      els.feedbackBox.className='feedback-box success';
      els.feedbackBox.innerHTML=`<strong>Correct.</strong>${escapeHtml(ex.explanation)}`;
      els.feedbackBox.classList.remove('hidden'); els.showSolutionBtn.classList.add('hidden');
    } else {
      setResult(ex.id,{status:'incorrect',attempts,solutionViewed:true});
      els.feedbackBox.className='feedback-box error';
      els.feedbackBox.innerHTML=`<strong>Réponse incorrecte.</strong>La réponse correcte est affichée immédiatement ci-dessous pour vous permettre de comprendre l’erreur.`;
      els.feedbackBox.classList.remove('hidden');
      els.solutionBox.innerHTML=`<strong>Réponse correcte</strong><br>${escapeHtml(ex.solution)}<br><span style="color:var(--muted)">${escapeHtml(ex.explanation)}</span>`;
      els.solutionBox.classList.remove('hidden');
      els.showSolutionBtn.classList.add('hidden');
    }
    renderNav(); renderHome();
  }

  function showHint(){
    const ex=currentExercise(); state.hintShown[ex.id]=true; save();
    els.hintBox.textContent=ex.hint || 'Revenez à la question métier et identifiez l’axe de regroupement.'; els.hintBox.classList.remove('hidden');
  }
  function showSolution(){
    const ex=currentExercise(); setResult(ex.id,{status:getResult(ex.id).status==='correct'?'correct':'incorrect',solutionViewed:true});
    els.solutionBox.innerHTML=`<strong>Solution expliquée</strong><br>${escapeHtml(ex.solution)}<br><span style="color:var(--muted)">${escapeHtml(ex.explanation)}</span>`;
    els.solutionBox.classList.remove('hidden'); renderHome();
  }

  function move(delta){
    if(delta>0 && poolIndex===pool.length-1){ renderResults(); return; }
    poolIndex=Math.min(pool.length-1,Math.max(0,poolIndex+delta)); state.currentId=pool[poolIndex]; save(); renderExercise(); window.scrollTo({top:0,behavior:'smooth'});
  }

  function renderResults(){
    const total=EX.length, correct=EX.filter(e=>getResult(e.id).status==='correct').length, incorrect=EX.filter(e=>getResult(e.id).status==='incorrect').length;
    const pct=Math.round(correct/total*100);
    els.resultHero.innerHTML=`<strong>${correct} / ${total}</strong> exercices maîtrisés · <strong>${pct}%</strong> de maîtrise globale · ${incorrect} notion${incorrect>1?'s':''} à retravailler.`;
    const cats=[...new Set(EX.map(e=>e.category))];
    const scores=cats.map(cat=>{const items=EX.filter(e=>e.category===cat), c=items.filter(e=>getResult(e.id).status==='correct').length; return {cat,p:Math.round(c/items.length*100)};}).sort((a,b)=>b.p-a.p);
    els.masteredList.innerHTML=(scores.filter(s=>s.p>=70).map(s=>`<span class="tag">${s.cat} · ${s.p}%</span>`).join('') || '<span class="tag">Continuez : la maîtrise se construit.</span>');
    els.reviewList.innerHTML=(scores.filter(s=>s.p<70).map(s=>`<span class="tag">${s.cat} · ${s.p}%</span>`).join('') || '<span class="tag">Aucune faiblesse majeure détectée.</span>');
    const weak=scores.filter(s=>s.p<70).slice(0,3).map(s=>s.cat);
    els.recommendation.textContent = weak.length ? `Conseil : reprenez en priorité ${weak.join(', ')}. Pour chaque erreur, reformulez la question métier avant de choisir la clé.` : 'Très bon niveau. Refaites les missions intégratrices sans indice pour vérifier que le raisonnement est devenu automatique.';
    showView('resultsView'); renderHome();
  }

  function restart(){
    state=emptyState(); save(); buildPool('all'); renderHome(); showView('homeView');
  }

  function escapeHtml(s){ return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

  els.startBtn.addEventListener('click',()=>start('all',true));
  els.resumeBtn.addEventListener('click',()=>start(state.mode||'all',false));
  els.homeBtn.addEventListener('click',()=>{renderHome();showView('homeView');});
  els.reviewBtn.addEventListener('click',()=>start('review',true));
  els.resetBtn.addEventListener('click',()=>{if(confirm('Réinitialiser toute la progression ?')) restart();});
  els.hintBtn.addEventListener('click',showHint); els.checkBtn.addEventListener('click',check); els.showSolutionBtn.addEventListener('click',showSolution);
  els.prevBtn.addEventListener('click',()=>move(-1)); els.nextBtn.addEventListener('click',()=>move(1));
  els.resultsReviewBtn.addEventListener('click',()=>start('review',true)); els.restartBtn.addEventListener('click',restart);

  buildPool(state.mode||'all'); renderHome(); showView('homeView');
})();
