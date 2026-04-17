// Renovate - Home Project Manager
(function(){
'use strict';
const i18n={
en:{projects:'Projects',new_project:'New Project',project_name:'Room / Project',budget:'Budget ($)',save:'Save',language:'Language',tasks:'Tasks',new_task:'New Task',task_name:'Task',cost:'Cost ($)',status:'Status',no_projects:'No projects yet. Tap + to start.',no_tasks:'No tasks. Tap + to add.',spent:'Spent',remaining:'Remaining',todo:'To Do',doing:'In Progress',done:'Done'},
zh:{projects:'\u9879\u76ee',new_project:'\u65b0\u9879\u76ee',project_name:'\u623f\u95f4/\u9879\u76ee',budget:'\u9884\u7b97 (\u00a5)',save:'\u4fdd\u5b58',language:'\u8bed\u8a00',tasks:'\u4efb\u52a1',new_task:'\u65b0\u4efb\u52a1',task_name:'\u4efb\u52a1',cost:'\u8d39\u7528 (\u00a5)',status:'\u72b6\u6001',no_projects:'\u8fd8\u6ca1\u6709\u9879\u76ee\u3002',no_tasks:'\u8fd8\u6ca1\u6709\u4efb\u52a1\u3002',spent:'\u5df2\u82b1',remaining:'\u5269\u4f59',todo:'\u5f85\u529e',doing:'\u8fdb\u884c\u4e2d',done:'\u5b8c\u6210'},
es:{projects:'Proyectos',new_project:'Nuevo Proyecto',project_name:'Habitaci\u00f3n',budget:'Presupuesto ($)',save:'Guardar',language:'Idioma',tasks:'Tareas',new_task:'Nueva Tarea',task_name:'Tarea',cost:'Costo ($)',status:'Estado',no_projects:'Sin proyectos.',no_tasks:'Sin tareas.',spent:'Gastado',remaining:'Restante',todo:'Pendiente',doing:'En progreso',done:'Hecho'},
ja:{projects:'\u30d7\u30ed\u30b8\u30a7\u30af\u30c8',new_project:'\u65b0\u898f\u30d7\u30ed\u30b8\u30a7\u30af\u30c8',project_name:'\u90e8\u5c4b/\u30d7\u30ed\u30b8\u30a7\u30af\u30c8',budget:'\u4e88\u7b97 (\u00a5)',save:'\u4fdd\u5b58',language:'\u8a00\u8a9e',tasks:'\u30bf\u30b9\u30af',new_task:'\u65b0\u3057\u3044\u30bf\u30b9\u30af',task_name:'\u30bf\u30b9\u30af',cost:'\u8cbb\u7528 (\u00a5)',status:'\u30b9\u30c6\u30fc\u30bf\u30b9',no_projects:'\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u306a\u3057\u3002',no_tasks:'\u30bf\u30b9\u30af\u306a\u3057\u3002',spent:'\u4f7f\u7528\u6e08',remaining:'\u6b8b\u308a',todo:'\u672a\u5b8c\u4e86',doing:'\u9032\u884c\u4e2d',done:'\u5b8c\u4e86'},
de:{projects:'Projekte',new_project:'Neues Projekt',project_name:'Raum / Projekt',budget:'Budget (\u20ac)',save:'Speichern',language:'Sprache',tasks:'Aufgaben',new_task:'Neue Aufgabe',task_name:'Aufgabe',cost:'Kosten (\u20ac)',status:'Status',no_projects:'Keine Projekte.',no_tasks:'Keine Aufgaben.',spent:'Ausgegeben',remaining:'\u00dcbrig',todo:'Offen',doing:'In Arbeit',done:'Erledigt'},
fr:{projects:'Projets',new_project:'Nouveau projet',project_name:'Pi\u00e8ce / Projet',budget:'Budget (\u20ac)',save:'Enregistrer',language:'Langue',tasks:'T\u00e2ches',new_task:'Nouvelle t\u00e2che',task_name:'T\u00e2che',cost:'Co\u00fbt (\u20ac)',status:'Statut',no_projects:'Pas de projets.',no_tasks:'Pas de t\u00e2ches.',spent:'D\u00e9pens\u00e9',remaining:'Restant',todo:'\u00c0 faire',doing:'En cours',done:'Termin\u00e9'}
};
const SK='renovate_data';let state={lang:'en',projects:[]};let currentProjectId=null;
function load(){try{const r=localStorage.getItem(SK);if(r)state={...state,...JSON.parse(r)};}catch(e){}}
function save(){try{localStorage.setItem(SK,JSON.stringify(state));}catch(e){}}
function t(k){return(i18n[state.lang]&&i18n[state.lang][k])||i18n.en[k]||k;}
function applyI18n(){document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.getAttribute('data-i18n')));}
function genId(){return'p'+Date.now().toString(36);}

function renderProjects(){
    const list=document.getElementById('projectList');
    if(state.projects.length===0){list.innerHTML=`<div class="empty-state"><div class="empty-icon">&#128296;</div><p>${t('no_projects')}</p></div>`;return;}
    list.innerHTML='';
    state.projects.forEach(p=>{
        const totalCost=(p.tasks||[]).reduce((s,x)=>s+(x.cost||0),0);
        const doneTasks=(p.tasks||[]).filter(x=>x.status==='done').length;
        const totalTasks=(p.tasks||[]).length;
        const pct=totalTasks>0?Math.round(doneTasks/totalTasks*100):0;
        const card=document.createElement('div');card.className='project-card';
        card.innerHTML=`<button class="project-delete" data-id="${p.id}">&times;</button>
            <div class="project-name">&#128296; ${p.name}</div>
            <div class="project-meta">${t('budget')}: $${p.budget||0} &middot; $${totalCost} ${t('spent')}</div>
            <div class="project-progress"><div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div><span class="progress-text">${pct}%</span></div>`;
        card.addEventListener('click',e=>{if(e.target.classList.contains('project-delete'))return;currentProjectId=p.id;showProject();});
        card.querySelector('.project-delete').addEventListener('click',e=>{e.stopPropagation();state.projects=state.projects.filter(x=>x.id!==p.id);save();renderProjects();});
        list.appendChild(card);
    });
}

function showProject(){
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    document.getElementById('viewProject').classList.add('active');
    renderProject();
}

function renderProject(){
    const p=state.projects.find(x=>x.id===currentProjectId);if(!p)return;
    document.getElementById('projTitle').textContent='&#128296; '+p.name;
    const totalCost=(p.tasks||[]).reduce((s,x)=>s+(x.cost||0),0);
    const budget=p.budget||0;const pct=budget>0?Math.min(100,Math.round(totalCost/budget*100)):0;
    const overBudget=totalCost>budget;
    document.getElementById('budgetBar').innerHTML=`
        <div class="budget-labels"><span>${t('spent')}: <strong>$${totalCost}</strong></span><span>${t('remaining')}: <strong>$${Math.max(0,budget-totalCost)}</strong></span></div>
        <div class="budget-track"><div class="budget-fill" style="width:${pct}%;background:${overBudget?'var(--red)':pct>80?'var(--amber)':'var(--green)'}"></div></div>
        <div class="budget-labels"><span>${t('budget')}: $${budget}</span><span>${pct}%</span></div>`;
    const tList=document.getElementById('taskList');
    if((p.tasks||[]).length===0){tList.innerHTML=`<div class="empty-state"><p>${t('no_tasks')}</p></div>`;return;}
    tList.innerHTML='';
    (p.tasks||[]).forEach((task,idx)=>{
        const card=document.createElement('div');card.className='task-card';
        card.innerHTML=`<div class="task-status status-${task.status}"></div>
            <div class="task-info"><div class="task-name ${task.status==='done'?'done':''}">${task.name}</div><div class="task-cost">${task.cost?'$'+task.cost:''} &middot; ${t(task.status)}</div></div>
            <div class="task-actions"><button class="task-btn cycle" data-idx="${idx}">&#128260;</button><button class="task-btn del" data-idx="${idx}">&times;</button></div>`;
        card.querySelector('.cycle').addEventListener('click',()=>{
            const statuses=['todo','doing','done'];const ci=statuses.indexOf(task.status);
            p.tasks[idx].status=statuses[(ci+1)%3];save();renderProject();
        });
        card.querySelector('.del').addEventListener('click',()=>{p.tasks.splice(idx,1);save();renderProject();});
        tList.appendChild(card);
    });
}

function init(){
    load();applyI18n();renderProjects();
    document.getElementById('btnBack').addEventListener('click',()=>{currentProjectId=null;document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));document.getElementById('viewRooms').classList.add('active');renderProjects();});
    document.getElementById('btnAddProject').addEventListener('click',()=>{document.getElementById('inputProjName').value='';document.getElementById('inputProjBudget').value='';document.getElementById('modalAddProject').style.display='flex';});
    document.getElementById('btnCloseProj').addEventListener('click',()=>document.getElementById('modalAddProject').style.display='none');
    document.getElementById('modalAddProject').addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.style.display='none';});
    document.getElementById('btnSaveProj').addEventListener('click',()=>{const name=document.getElementById('inputProjName').value.trim();if(!name)return;state.projects.push({id:genId(),name,budget:parseFloat(document.getElementById('inputProjBudget').value)||0,tasks:[]});save();renderProjects();document.getElementById('modalAddProject').style.display='none';});
    document.getElementById('btnAddTask').addEventListener('click',()=>{document.getElementById('inputTaskName').value='';document.getElementById('inputTaskCost').value='';document.getElementById('inputTaskStatus').value='todo';document.getElementById('modalAddTask').style.display='flex';});
    document.getElementById('btnCloseTask').addEventListener('click',()=>document.getElementById('modalAddTask').style.display='none');
    document.getElementById('modalAddTask').addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.style.display='none';});
    document.getElementById('btnSaveTask').addEventListener('click',()=>{const name=document.getElementById('inputTaskName').value.trim();if(!name)return;const p=state.projects.find(x=>x.id===currentProjectId);if(!p)return;if(!p.tasks)p.tasks=[];p.tasks.push({name,cost:parseFloat(document.getElementById('inputTaskCost').value)||0,status:document.getElementById('inputTaskStatus').value});save();renderProject();document.getElementById('modalAddTask').style.display='none';});
    document.getElementById('btnLang').addEventListener('click',()=>document.getElementById('modalLang').style.display='flex');
    document.getElementById('btnCloseLang').addEventListener('click',()=>document.getElementById('modalLang').style.display='none');
    document.getElementById('modalLang').addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.style.display='none';});
    document.querySelectorAll('.lang-btn').forEach(btn=>{btn.addEventListener('click',()=>{state.lang=btn.getAttribute('data-lang');save();applyI18n();renderProjects();document.getElementById('modalLang').style.display='none';});});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
