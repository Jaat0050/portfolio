/* BotBlox-inspired portfolio structure layer. Content is limited to information supplied by Arjun/current portfolio. */
(function(){
  const main=document.querySelector('main');
  if(!main||document.getElementById('bb-credibility')) return;
  const skills=document.getElementById('skills'), experience=document.getElementById('experience'), portfolio=document.getElementById('portfolio'), contact=document.getElementById('contact');
  const make=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;e.innerHTML=html;return e};

  // Credibility strip: factual technology/platform markers rather than invented user counts.
  const credibility=make('section','bb-strip','<div class="container"><div class="bb-strip-label">ENGINEERING CREDENTIALS</div><div class="bb-strip-items"><span><b>01</b> Flutter & Dart</span><i></i><span><b>02</b> Firebase & Cloud</span><i></i><span><b>03</b> iOS + Android</span><i></i><span><b>04</b> AI / ML Integration</span></div></div>');
  credibility.id='bb-credibility'; main.insertBefore(credibility,skills||main.firstElementChild);

  // Selected collaborators strip — names supplied by the user prompt; no fabricated logos.
  const clients=make('section','bb-clients','<div class="container"><span class="bb-kicker">SELECTED CLIENTS & COLLABORATORS</span><div class="bb-client-row"><span>TTBS</span><span>VEDANTA FOUNDATION</span><span>LOANGURU</span><span>GO2MKT</span><span>JOBCLIFF</span></div></div>');
  clients.id='bb-clients';main.insertBefore(clients,skills||main.firstElementChild);

  // Focus areas.
  const focus=make('section','bb-focus section','<div class="container"><div class="section-heading reveal"><span>03 — WHERE I BUILD</span><h2>Systems, not just<br><i>screens.</i></h2></div><div class="bb-focus-grid">'+[
    ['01','CROSS-PLATFORM MOBILE','Flutter/Dart applications for iOS & Android.','fa-mobile-screen-button'],
    ['02','FIREBASE & BACKEND','Firestore, Cloud Functions, Auth, FCM and connected workflows.','fa-cloud'],
    ['03','AI / LLM INTEGRATION','AI APIs and on-device ML workflows including TFLite where appropriate.','fa-brain'],
    ['04','OFFLINE-FIRST','Local-first application flows, resilient data handling and sync-oriented architecture.','fa-database'],
    ['05','REAL-TIME SYSTEMS','Realtime communication, STOMP, chat, live updates and streaming workflows.','fa-bolt'],
    ['06','PRODUCT DELIVERY','UI implementation, testing, iOS/Android builds and store delivery.','fa-rocket']
  ].map(x=>`<article class="bb-focus-card reveal"><span class="bb-num">${x[0]}</span><i class="fa-solid ${x[3]}"></i><h3>${x[1]}</h3><p>${x[2]}</p></article>`).join('')+'</div></div>');
  focus.id='bb-focus'; main.insertBefore(focus,experience||main.firstElementChild);

  // Why work with me.
  const why=make('section','bb-why section section-dark','<div class="container"><div class="section-heading reveal"><span>04 — WHY WORK WITH ME</span><h2>Built for the<br><i>whole product.</i></h2></div><div class="bb-why-grid"><div class="bb-why-copy"><p>I work across the parts of a mobile product that have to fit together: interface, application architecture, APIs, cloud services, realtime features, testing and release. AI is treated as part of the product workflow when it creates a real advantage—not as decoration.</p></div><div class="bb-values">'+[
    ['01','END-TO-END OWNERSHIP','Architecture through deployment—not only UI screens.'],
    ['02','AI-NATIVE THINKING','AI and ML capabilities integrated around the product problem.'],
    ['03','ITERATIVE BUILDS','Prototype, evaluate and refine quickly before locking in the approach.']
  ].map(x=>`<article class="bb-value reveal"><span>${x[0]}</span><div><h3>${x[1]}</h3><p>${x[2]}</p></div></article>`).join('')+'</div></div></div>');
  why.id='bb-why'; main.insertBefore(why,portfolio||main.firstElementChild);

  // Add spec labels to existing project cards without inventing scale/timeline claims.
  if(portfolio){
    portfolio.querySelectorAll('.work').forEach((work,i)=>{
      if(work.querySelector('.bb-spec-grid')) return;
      const title=(work.querySelector('h3')?.textContent||'Project').trim();
      const tech=Array.from(work.querySelectorAll('.tech-row span')).map(x=>x.textContent.trim()).filter(Boolean).slice(0,3).join(', ')||'Flutter / Mobile';
      const spec=make('div','bb-spec-grid',`<div><span>PROJECT</span><b>${title}</b></div><div><span>STACK</span><b>${tech}</b></div><div><span>PLATFORM</span><b>iOS + Android</b></div>`);
      work.querySelector('.work-content')?.appendChild(spec);
    });
  }

  // Case studies use the existing project anchors instead of fabricated external pages.
  const cases=make('section','bb-cases section','<div class="container"><div class="section-heading reveal"><span>06 — CASE STUDIES</span><h2>Selected work,<br><i>closer look.</i></h2></div><div class="bb-case-grid">'+[
    ['01','SHIPLE','Events, people and realtime communication in a Flutter mobile experience.','#portfolio'],
    ['02','KOOKEASE','Recipe discovery, unit conversion, selections and shopping workflows.','#portfolio'],
    ['03','JOBCLIFF','A mobile product experience built around the JobCliff project context.','#portfolio']
  ].map(x=>`<article class="bb-case-card reveal"><span>${x[0]}</span><small>CASE STUDY</small><h3>${x[1]}</h3><p>${x[2]}</p><a href="${x[3]}">View project <i class="fa-solid fa-arrow-up-right-from-square"></i></a></article>`).join('')+'</div></div>');
  cases.id='bb-cases';main.insertBefore(cases,contact||main.lastElementChild);

  // Technical writing section. Link to Medium only if the user has supplied the destination; no fabricated post titles.
  const blog=make('section','bb-writing section section-dark','<div class="container"><div class="section-heading reveal"><span>07 — TECHNICAL WRITING</span><h2>Notes from the<br><i>build process.</i></h2></div><div class="bb-writing-grid"><article class="bb-writing-card"><span>FLUTTER</span><h3>Architecture, APIs and production mobile engineering</h3><p>A place for technical notes, implementation patterns and lessons from building Flutter applications.</p></article><article class="bb-writing-card"><span>AI</span><h3>Building AI-powered mobile experiences</h3><p>Practical thinking around connecting mobile products with AI and ML capabilities.</p></article><article class="bb-writing-card"><span>REAL-TIME</span><h3>Realtime communication in mobile products</h3><p>Patterns for chat, live updates and connected application experiences.</p></article></div></div>');
  blog.id='bb-writing'; main.insertBefore(blog,contact||main.lastElementChild);

  // Closing editorial CTA.
  if(contact){
    const closing=make('section','bb-closing','<div class="container"><span>08 — NEXT BUILD</span><h2>Let’s build something<br><i>production-ready.</i></h2><a href="#contact" class="primary-btn magnetic">Get in touch <i class="fa-solid fa-arrow-right"></i></a><strong>AR</strong></div>');
    closing.id='bb-closing';main.insertBefore(closing,contact);
  }

  // Sticky navigation treatment + scroll reveal for newly inserted sections.
  const nav=document.querySelector('nav');
  const navTick=()=>nav?.classList.toggle('nav-scrolled',window.scrollY>24);window.addEventListener('scroll',navTick,{passive:true});navTick();
  const bbObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('bb-visible');bbObserver.unobserve(entry.target)}}),{threshold:.12});
  document.querySelectorAll('.bb-focus-card,.bb-value,.bb-case-card,.bb-writing-card,.bb-closing,.bb-strip,.bb-clients').forEach(el=>bbObserver.observe(el));

  // Horizontal/vertical project feel without hijacking native mobile scrolling.
  const projectList=portfolio?.querySelector('.work-list');
  if(projectList){let last=0;const onScroll=()=>{const r=projectList.getBoundingClientRect();const p=Math.max(0,Math.min(1,(window.innerHeight-r.top)/(window.innerHeight+r.height)));if(Math.abs(p-last)>.003){projectList.style.setProperty('--bb-project-progress',(p*100).toFixed(1)+'%');last=p}};window.addEventListener('scroll',onScroll,{passive:true});onScroll()}
})();
