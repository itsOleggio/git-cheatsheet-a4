/* eslint-disable */
// @ts-nocheck
import './styles/tokens.css';
import './styles/base.css';
import './styles/sheet.css';
import './styles/sheet1.css';
import './styles/sheet2.css';
import './styles/print.css';

const LANES={main:"var(--main)",feat:"var(--feat)",fix:"var(--fix)",rel:"var(--rel)"};
// c: command, d: short label, t: new/old, x: example/long hint, w: warning, p: pair index
const S=[
 {h:"Настройка",l:"main",cmds:[
  {c:'git config --global user.name "Имя"',d:"имя автора"},
  {c:'git config --global user.email "a@b.c"',d:"почта автора"},
  {c:"git config --global init.defaultBranch main",d:"ветка по умолч."},
  {c:"git init",d:"новый репозиторий"},
  {c:"git clone <url>",d:"скопировать репо"},
  {c:"git clone --depth 1 <url>",d:"только последний",x:"Shallow clone: без истории, быстро для CI"},
  {c:"git clone --filter=blob:none <url>",d:"partial clone",t:"new",x:"Файлы подкачиваются по требованию — быстро для больших репо"},
 ]},
 {h:"Изменения",l:"main",cmds:[
  {c:"git status -sb",d:"краткий статус"},
  {c:"git add <file>",d:"в индекс"},
  {c:"git add -p",d:"по кусочкам",x:"Интерактивно выбираешь, какие ханки добавить"},
  {c:'git commit -m "msg"',d:"коммит"},
  {c:"git commit --amend",d:"поправить последний",w:"Меняет хэш — не делай после push"},
  {c:"git diff",d:"рабочая vs индекс"},
  {c:"git diff --staged",d:"индекс vs HEAD"},
  {c:"git rm --cached <file>",d:"убрать из git"},
 ]},
 {h:"Ветки",l:"feat",pairs:[["git checkout <br>","git switch <br>"],["git checkout -b <br>","git switch -c <br>"]],cmds:[
  {c:"git switch <branch>",d:"перейти",t:"new"},
  {c:"git checkout <branch>",d:"перейти",t:"old",x:"Перегружена смыслами — используй switch/restore"},
  {c:"git switch -c <new>",d:"создать+перейти",t:"new"},
  {c:"git checkout -b <new>",d:"создать+перейти",t:"old"},
  {c:"git switch -",d:"предыдущая ветка",t:"new"},
  {c:"git branch -vv",d:"список + upstream"},
  {c:"git branch -m <new>",d:"переименовать"},
  {c:"git branch -d <br>",d:"удалить (смерж.)"},
  {c:"git branch -D <br>",d:"удалить силой",w:"Несмерженные коммиты останутся только в reflog"},
 ]},
 {h:"Отмена",l:"fix",pairs:[["git checkout -- f","git restore f"],["git reset HEAD f","git restore --staged f"]],cmds:[
  {c:"git restore <file>",d:"сбросить файл",t:"new",w:"Несохранённые правки файла пропадут"},
  {c:"git checkout -- <file>",d:"сбросить файл",t:"old",w:"Несохранённые правки файла пропадут"},
  {c:"git restore --staged <file>",d:"из индекса",t:"new"},
  {c:"git reset HEAD <file>",d:"из индекса",t:"old"},
  {c:"git restore -s HEAD~1 <file>",d:"версия из коммита",t:"new"},
  {c:"git reset --soft HEAD~1",d:"откат, правки в индексе"},
  {c:"git reset --mixed HEAD~1",d:"откат, правки в файлах"},
  {c:"git reset --hard HEAD~1",d:"откат начисто",w:"Удаляет коммит и все правки"},
  {c:"git revert <sha>",d:"анти-коммит",x:"Безопасно для общих веток — история не переписывается"},
  {c:"git clean -fd",d:"удалить untracked",w:"Удаляет неотслеживаемые файлы безвозвратно. Сначала git clean -n"},
 ]},
 {h:"Слияние",l:"feat",cmds:[
  {c:"git merge <br>",d:"влить ветку"},
  {c:"git merge --no-ff <br>",d:"всегда merge-коммит"},
  {c:"git merge --squash <br>",d:"одним коммитом"},
  {c:"git rebase main",d:"перенести на main",w:"Переписывает историю ветки"},
  {c:"git rebase -i HEAD~3",d:"squash / reword",x:"pick, squash, fixup, reword, drop"},
  {c:"git rebase --update-refs",d:"двигать стек веток",t:"new",x:"Git 2.38+: обновляет все ветки стека при rebase"},
  {c:"git cherry-pick <sha>",d:"взять коммит"},
  {c:"git merge --abort",d:"отменить merge"},
 ]},
 {h:"Удалённые",l:"rel",cmds:[
  {c:"git remote -v",d:"список remote"},
  {c:"git fetch --prune",d:"скачать, без слияния"},
  {c:"git pull --rebase",d:"забрать + rebase"},
  {c:"git push -u origin <br>",d:"первый push"},
  {c:"git push --force-with-lease",d:"безопасный force",t:"new",x:"Не затрёт чужие коммиты, в отличие от --force"},
  {c:"git push --force",d:"перезаписать",t:"old",w:"Может затереть чужую работу на сервере"},
  {c:"git push origin --delete <br>",d:"удалить ветку"},
  {c:"git push --tags",d:"отправить теги"},
 ]},
 {h:"Stash",l:"rel",cmds:[
  {c:'git stash push -m "wip"',d:"спрятать",t:"new"},
  {c:"git stash save \"wip\"",d:"спрятать",t:"old",x:"Устарело с 2.16 — используй stash push"},
  {c:"git stash -u",d:"+ untracked"},
  {c:"git stash list",d:"список"},
  {c:"git stash pop",d:"достать и удалить"},
  {c:"git stash apply stash@{1}",d:"достать копию"},
 ]},
 {h:"История",l:"main",cmds:[
  {c:"git log --oneline --graph --all",d:"граф веток"},
  {c:"git log -p <file>",d:"история файла"},
  {c:"git show <sha>",d:"что в коммите"},
  {c:"git blame -L 10,20 <f>",d:"кто писал строки"},
  {c:"git reflog",d:"найти потерянное",x:"Все перемещения HEAD — тут найдёшь «потерянное»"},
  {c:"git bisect start",d:"поиск бага"},
  {c:"git grep \"TODO\"",d:"поиск в коде"},
  {c:"git tag -a v1.0 -m \"…\"",d:"тег релиза"},
 ]},
 {h:"Современный Git",l:"fix",cmds:[
  {c:"git worktree add ../hf hotfix",d:"2-я рабочая папка",t:"new",x:"Две ветки открыты одновременно, без stash"},
  {c:"git sparse-checkout set src/",d:"часть монорепо",t:"new"},
  {c:"git maintenance start",d:"фоновая оптимизация",t:"new"},
  {c:"git switch --detach <sha>",d:"detached HEAD",t:"new"},
  {c:"git range-diff A...B",d:"сравнить версии PR",t:"new"},
  {c:"git commit --fixup=<sha>",d:"фикс к коммиту",x:"Потом git rebase -i --autosquash"},
  {c:"git config rerere.enabled true",d:"помнить конфликты"},
 ]},
];

// Detailed descriptions for tooltips
const LONG={
'git config --global user.name "Имя"':"Задаёт имя, которое попадёт в поле Author каждого коммита. Флаг --global пишет в ~/.gitconfig для всех репозиториев; без него — только в текущий (.git/config).",
'git config --global user.email "a@b.c"':"Задаёт email автора коммитов. Должен совпадать с почтой в GitHub/GitLab, иначе коммиты не привяжутся к аккаунту.",
"git config --global init.defaultBranch main":"Меняет имя первой ветки при git init с master на main. Работает с Git 2.28+.",
"git init":"Создаёт пустой репозиторий в текущей папке: появляется скрытая папка .git с историей и настройками. Файлы при этом ещё не отслеживаются.",
"git clone <url>":"Скачивает удалённый репозиторий целиком: всю историю, все ветки, и создаёт remote с именем origin. Сразу переключается на ветку по умолчанию.",
"git clone --depth 1 <url>":"Shallow clone: скачивает только последний коммит без истории. Быстро, подходит для CI и сборки. Минус: log, blame и rebase по старой истории не работают, пока не сделаешь git fetch --unshallow.",
"git clone --filter=blob:none <url>":"Partial clone (Git 2.19+): скачивает всю историю коммитов, а содержимое файлов скачивает, только когда оно нужно. Для больших репозиториев: история на месте, клонирование быстрое.",
"git status -sb":"Показывает состояние рабочей папки в кратком виде: -s — короткий формат (M изменён, A добавлен, ?? не отслеживается), -b — текущая ветка и насколько она впереди/позади upstream.",
"git add <file>":"Добавляет текущее состояние файла в индекс (staging area), чтобы потом закоммитить. git add . добавит всё в текущей папке.",
"git add -p":"Интерактивное добавление по ханкам (кускам изменений). На каждый кусок отвечаешь y/n/s (разделить)/e (редактировать). Так правки в одном файле можно разбить на несколько коммитов.",
'git commit -m "msg"':"Создаёт коммит из того, что лежит в индексе, с сообщением msg. Добавь -a, чтобы автоматически закоммитить все изменённые отслеживаемые файлы без git add.",
"git commit --amend":"Заменяет последний коммит новым: добавляет туда то, что в индексе, и даёт поправить сообщение. Создаётся новый хэш, поэтому после push потребуется force push.",
"git diff":"Показывает изменения в рабочей папке, которые ещё не добавлены в индекс.",
"git diff --staged":"Показывает, что уже добавлено в индекс и попадёт в следующий коммит (разница между индексом и HEAD). Синоним — --cached.",
"git rm --cached <file>":"Перестаёт отслеживать файл, но оставляет его на диске. Пример: случайно закоммитили .env или node_modules: убираешь из git и добавляешь в .gitignore.",
"git switch <branch>":"Переключает на существующую ветку (Git 2.23+). Работает только с ветками, в отличие от checkout, который делает и многое другое. Если незакоммиченные правки конфликтуют с веткой, переключения не будет.",
"git checkout <branch>":"Старый способ переключиться на ветку. Проблема checkout в том, что он делает слишком многое: переключает ветки, восстанавливает файлы, отсоединяет HEAD. Ошибка в аргументе может молча перезаписать файл.",
"git switch -c <new>":"Создаёт новую ветку от текущего коммита и сразу переключается на неё. Можно указать точку старта: git switch -c feat origin/main.",
"git checkout -b <new>":"Старый эквивалент switch -c: создаёт ветку и переключается на неё. До сих пор работает и встречается во всех туториалах.",
"git switch -":"Переключает на предыдущую ветку, как cd - в терминале. Помогает переключаться туда-обратно между двумя ветками.",
"git branch -vv":"Список локальных веток с последним коммитом и привязкой к удалённой ветке ([origin/main: ahead 2, behind 1]). Видно, какие ветки отстали или ушли вперёд.",
"git branch -m <new>":"Переименовывает текущую ветку. Для другой ветки: git branch -m old new. На сервере старое имя останется: запушь новое и удали старое.",
"git branch -d <br>":"Удаляет локальную ветку, только если она уже влита в текущую или в свой upstream. Защита от потери коммитов.",
"git branch -D <br>":"Принудительно удаляет ветку, даже если её коммиты никуда не влиты. Коммиты исчезают не сразу: их ещё можно найти через git reflog в течение ~90 дней.",
"git restore <file>":"Возвращает файл в рабочей папке к состоянию из индекса (Git 2.23+). Все несохранённые правки в этом файле пропадут без возможности восстановления.",
"git checkout -- <file>":"Старый способ откатить файл к версии из индекса. Двойной дефис отделяет имя файла от имени ветки. Без него при совпадении имён можно случайно переключить ветку.",
"git restore --staged <file>":"Убирает файл из индекса (unstage), но правки на диске сохраняются. Ничего не теряется.",
"git reset HEAD <file>":"Старый способ убрать файл из индекса. Делает то же, что restore --staged. Но reset с другими флагами стирает изменения, поэтому для этой задачи лучше restore.",
"git restore -s HEAD~1 <file>":"Достаёт версию файла из указанного коммита (-s = --source) и кладёт в рабочую папку. HEAD~1 — предыдущий коммит, можно указать любой хэш или ветку.",
"git reset --soft HEAD~1":"Отменяет последний коммит, но все его изменения остаются в индексе и готовы к новому коммиту. Так можно переделать коммит или объединить несколько в один.",
"git reset --mixed HEAD~1":"Режим по умолчанию: отменяет коммит, изменения остаются в файлах, но убраны из индекса. Можно заново выбрать, что и как коммитить.",
"git reset --hard HEAD~1":"Отменяет коммит и полностью стирает его изменения из индекса и рабочей папки. Незакоммиченные правки пропадут навсегда; сам коммит можно вернуть через reflog.",
"git revert <sha>":"Создаёт новый коммит, который делает обратное указанному. История не переписывается, поэтому так отменяют уже запушенный коммит в общей ветке.",
"git clean -fd":"Удаляет все неотслеживаемые файлы (-f) и папки (-d). Сначала запусти git clean -n: покажет, что будет удалено. Добавь -x, чтобы удалить и игнорируемые файлы.",
"git merge <br>":"Вливает указанную ветку в текущую. Если текущая ветка не ушла вперёд, делает fast-forward (просто двигает указатель), иначе создаёт merge-коммит с двумя родителями.",
"git merge --no-ff <br>":"Всегда создаёт merge-коммит, даже если возможен fast-forward. В истории остаётся видно, что была отдельная фича-ветка.",
"git merge --squash <br>":"Собирает все изменения ветки в индекс одним куском, не делая коммит. Дальше делаешь git commit, и вся фича становится одним коммитом.",
"git rebase main":"Переносит коммиты текущей ветки поверх свежего main, как будто ты начал работу только что. История получается линейной. Все хэши переносимых коммитов меняются.",
"git rebase -i HEAD~3":"Интерактивный rebase последних 3 коммитов. В редакторе для каждого выбираешь: pick — оставить, reword — сменить сообщение, squash/fixup — склеить с предыдущим, drop — удалить, можно менять порядок строк.",
"git rebase --update-refs":"Git 2.38+. При rebase стека веток (feat-1 → feat-2 → feat-3) автоматически двигает все промежуточные ветки, а не только текущую. Можно включить навсегда: rebase.updateRefs true.",
"git cherry-pick <sha>":"Копирует один конкретный коммит из другой ветки в текущую как новый коммит. Например, чтобы перенести багфикс в релизную ветку без остальных изменений.",
"git merge --abort":"Отменяет слияние, которое остановилось на конфликтах, и возвращает всё как было до merge. Аналог для rebase — git rebase --abort.",
"git remote -v":"Показывает подключённые удалённые репозитории и их адреса для fetch и push. Добавить новый: git remote add upstream <url>.",
"git fetch --prune":"Скачивает новые коммиты и ветки с сервера, но не трогает твои локальные ветки. --prune удаляет локальные ссылки на ветки, которых на сервере уже нет.",
"git pull --rebase":"Делает fetch, а потом переносит твои локальные коммиты поверх полученных вместо merge-коммита. История остаётся линейной. Включить по умолчанию: git config pull.rebase true.",
"git push -u origin <br>":"Отправляет ветку на сервер и запоминает связь (upstream). После этого достаточно писать просто git push и git pull.",
"git push --force-with-lease":"Перезаписывает ветку на сервере, но только если там нет коммитов, которых ты не видел при последнем fetch. Нужен после rebase или amend, при этом защищает от затирания работы коллег.",
"git push --force":"Перезаписывает ветку на сервере твоей версией без проверок. Если кто-то успел запушить свои коммиты, они пропадут. Используй --force-with-lease.",
"git push origin --delete <br>":"Удаляет ветку на сервере. Локальная ветка остаётся, её удаляй отдельно через git branch -d.",
"git push --tags":"Отправляет на сервер все локальные теги: обычный push их не отправляет. Один тег: git push origin v1.0.",
'git stash push -m "wip"':"Прячет незакоммиченные изменения во временное хранилище и очищает рабочую папку. -m задаёт подпись. Можно спрятать только часть: git stash push -- path/file.",
'git stash save "wip"':"Устаревший синтаксис (deprecated с Git 2.16). Не умеет прятать отдельные файлы. Замени на git stash push -m.",
"git stash -u":"Прячет вместе с неотслеживаемыми (новыми) файлами. Без -u новые файлы остаются в рабочей папке.",
"git stash list":"Список всех спрятанных наборов: stash@{0} — самый свежий. Посмотреть содержимое: git stash show -p stash@{0}.",
"git stash pop":"Возвращает последний stash в рабочую папку и удаляет его из списка. При конфликте stash не удаляется: разреши конфликт и сделай git stash drop.",
"git stash apply stash@{1}":"Применяет указанный stash, но оставляет его в списке. Пригодится, если те же изменения нужны в нескольких ветках.",
"git log --oneline --graph --all":"Компактная история всех веток в виде ASCII-графа: каждый коммит одной строкой. Добавь --decorate, чтобы видеть ветки и теги. Алиас: git config --global alias.lg 'log --oneline --graph --all'.",
"git log -p <file>":"История конкретного файла с полным diff каждого изменения. Добавь --follow, чтобы отслеживать файл через переименования.",
"git show <sha>":"Показывает метаданные коммита (автор, дата, сообщение) и полный diff. Без аргумента — последний коммит. git show HEAD:path/file выведет файл как он был в коммите.",
"git blame -L 10,20 <f>":"Для каждой строки 10–20 показывает, в каком коммите и кем она была изменена последний раз. -w игнорирует изменения пробелов, -C ищет перенос кода из других файлов.",
"git reflog":"Журнал всех перемещений HEAD: коммиты, переключения, reset, rebase. Через него находят потерянные коммиты: нашёл хэш до неудачного reset — выполнил git reset --hard <sha>. Хранится ~90 дней, только локально.",
"git bisect start":"Бинарный поиск коммита, который внёс баг. Отмечаешь git bisect bad (сломано) и git bisect good <sha> (работало). Git переключает на середину, ты проверяешь и отвечаешь, пока не найдётся виновник. Завершить: git bisect reset.",
'git grep "TODO"':"Ищет текст по отслеживаемым файлам. Быстрее обычного grep и игнорирует node_modules. -n — номера строк, можно искать в другом коммите: git grep TODO v1.0.",
'git tag -a v1.0 -m "…"':"Создаёт аннотированный тег с автором, датой и сообщением. Им отмечают релизы. Без -a создаётся лёгкий тег, просто указатель.",
"git worktree add ../hf hotfix":"Создаёт вторую рабочую папку ../hf с веткой hotfix, привязанную к тому же репозиторию. Можно чинить срочный баг, не трогая и не прятая текущую работу. Удалить: git worktree remove ../hf.",
"git sparse-checkout set src/":"Оставляет в рабочей папке только указанные директории, остальное не выкачивается на диск. Применяют в монорепозиториях. Вернуть всё: git sparse-checkout disable.",
"git maintenance start":"Регистрирует репозиторий для фоновых оптимизаций по расписанию: prefetch, commit-graph, упаковка объектов. Ускоряет fetch, log и status в больших репозиториях.",
"git switch --detach <sha>":"Переходит на конкретный коммит в режиме detached HEAD (без ветки). Подходит, чтобы посмотреть старую версию. Новые коммиты здесь легко потерять, поэтому создай ветку через git switch -c.",
"git range-diff A...B":"Сравнивает две версии серии коммитов, например PR до и после rebase. Показывает, какие коммиты изменились и как. Нужно при ревью после force-push.",
"git commit --fixup=<sha>":"Создаёт коммит с пометкой fixup! для указанного коммита. Потом git rebase -i --autosquash сам поставит его в нужное место и склеит. Так исправляют коммиты из середины ветки.",
"git config rerere.enabled true":"Rerere (reuse recorded resolution) запоминает, как ты разрешил конфликт, и в следующий раз применит то же решение автоматически. Экономит время при частых rebase длинных веток.",
};

// Graph
const G=document.getElementById("graph"),NS="http://www.w3.org/2000/svg";
const el=(t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);return e};
const Y={rel:20,main:60,feat:100,fix:135};
const lanes={
  main:{path:"M10 60 H510",dots:[[30,60],[90,60],[160,60],[250,60],[330,60],[400,60],[480,60]],label:"main"},
  feat:{path:"M90 60 C110 60 110 100 130 100 H230 C250 100 250 60 250 60",dots:[[150,100],[190,100],[220,100]],label:"feature/login"},
  fix:{path:"M330 60 C345 60 345 135 360 135 H380 C395 135 400 60 400 60",dots:[[365,135]],label:"hotfix/42"},
  rel:{path:"M250 60 C265 60 265 20 280 20 H440 C460 20 460 60 480 60",dots:[[300,20],[360,20],[420,20]],label:"release/1.2"},
};
for(const k of ["feat","fix","rel","main"]){
  const g=el("g",{class:"lane","data-l":k});
  g.append(el("path",{d:lanes[k].path,fill:"none",stroke:LANES[k],"stroke-width":3,"stroke-linecap":"round"}));
  lanes[k].dots.forEach(([x,y])=>g.append(el("circle",{cx:x,cy:y,r:5,fill:"var(--sheet)",stroke:LANES[k],"stroke-width":2.5})));
  const lx={main:14,feat:132,fix:300,rel:282}[k], ly={main:52,feat:118,fix:145,rel:12}[k];
  const t=el("text",{x:lx,y:ly,fill:LANES[k],"font-family":"JetBrains Mono, monospace","font-size":9});t.textContent=lanes[k].label;g.append(t);
  G.append(g);
}
const hd=el("g",{});hd.append(el("rect",{x:462,y:66,width:38,height:14,rx:3,fill:"var(--fg)"}));
const ht=el("text",{x:468,y:76,fill:"var(--bg)","font-family":"JetBrains Mono, monospace","font-size":8.5,"font-weight":700});ht.textContent="HEAD";hd.append(ht);
const tg=el("text",{x:394,y:52,fill:"var(--tag)","font-family":"JetBrains Mono, monospace","font-size":8.5});tg.textContent="◆ v1.1.1";
G.append(hd,tg);

// Align the middle title line with the main branch
function alignTitle(){
  const h=document.getElementById("ttl"),m=document.getElementById("ttl-mid");
  h.style.top="0px";
  if(innerWidth<=760)return;
  const g=G.getBoundingClientRect(),mr=m.getBoundingClientRect();
  const mainY=g.top+g.height*60/150, midY=mr.top+mr.height/2;
  h.style.top=(mainY-midY)+"px";
}
addEventListener("resize",alignTitle);
(document.fonts?document.fonts.ready:Promise.resolve()).then(alignTitle);alignTitle();

// Sections
const grid=document.getElementById("grid");
S.forEach(s=>{
  const sec=document.createElement("section");sec.className="sec";sec.style.setProperty("--c",LANES[s.l]);sec.dataset.l=s.l;
  sec.innerHTML=`<h2>${s.h}</h2>`;
  s.cmds.forEach(c=>{
    const b=document.createElement("button");b.className="cmd"+(c.w?" danger":"");b.dataset.t=c.t||"";
    b.innerHTML=`<code></code>${c.t?`<span class="badge ${c.t}">${c.t.toUpperCase()}</span>`:""}<span class="d"></span>`;
    b.querySelector("code").textContent=c.c;b.querySelector(".d").textContent=c.d;b._c=c;b._sec=s;
    sec.append(b);
  });
  if(s.pairs){s.pairs.forEach(([o,n])=>{const p=document.createElement("div");p.className="pair";p.innerHTML=`<span></span> <span class="arrow">→</span> <span style="color:var(--fg)"></span>`;p.children[0].textContent=o;p.children[2].textContent=n;sec.append(p)})}
  sec.addEventListener("mouseenter",()=>{G.classList.add("dim");G.querySelector(`[data-l="${s.l}"]`).classList.add("on")});
  sec.addEventListener("mouseleave",()=>{G.classList.remove("dim");G.querySelectorAll(".on").forEach(e=>e.classList.remove("on"))});
  grid.append(sec);
});

// Tooltip
const tip=document.getElementById("tip");
grid.addEventListener("mousemove",e=>{
  const b=e.target.closest(".cmd");if(!b){tip.hidden=true;return}
  const c=b._c;tip.innerHTML="";
  const code=document.createElement("code");code.textContent=c.c;tip.append(code);
  const h=document.createElement("div");h.className="tl";h.textContent=c.d[0].toUpperCase()+c.d.slice(1)+(c.t==="new"?" · новый способ":c.t==="old"?" · старый способ":"");tip.append(h);
  const d=document.createElement("div");d.textContent=LONG[c.c]||c.x||"";tip.append(d);
  if(c.x&&LONG[c.c]){const x=document.createElement("div");x.className="ex";x.textContent="→ "+c.x;tip.append(x)}
  if(c.w){const w=document.createElement("div");w.className="w";w.textContent="⚠ "+c.w;tip.append(w)}
  tip.hidden=false;
  const r=tip.getBoundingClientRect();let x=e.clientX+14,y=e.clientY+14;
  if(x+r.width>innerWidth-8)x=e.clientX-r.width-14;if(y+r.height>innerHeight-8)y=e.clientY-r.height-14;
  tip.style.left=Math.max(8,x)+"px";tip.style.top=Math.max(8,y)+"px";
});
grid.addEventListener("mouseleave",()=>tip.hidden=true);

// Copy
const toast=document.getElementById("toast");let tt;
const show=m=>{toast.textContent=m;toast.hidden=false;clearTimeout(tt);tt=setTimeout(()=>toast.hidden=true,1400)};
grid.addEventListener("click",e=>{
  const b=e.target.closest(".cmd");if(!b)return;const text=b._c.c;
  const fallback=()=>{const r=document.createRange();r.selectNodeContents(b.querySelector("code"));const s=getSelection();s.removeAllRanges();s.addRange(r);show("Выделено — нажми Ctrl+C")};
  try{navigator.clipboard.writeText(text).then(()=>show("Скопировано: "+text),fallback)}catch(_){fallback()}
});

document.querySelectorAll(".ntab .ex").forEach(td=>{td.title="Скопировать git switch -c";td.addEventListener("click",()=>{
  const t="git switch -c "+td.textContent;try{navigator.clipboard.writeText(t).then(()=>show("Скопировано: "+t),()=>show(t))}catch(_){show(t)}
})});


// ---- Sheet 2: commit log graph ----
(function(){
  const L=document.getElementById("log"),X={main:22,feat:46,hot:70},RH=24,T=14;
  const TC={feat:"var(--feat)",fix:"var(--fix)",refactor:"#2dd4bf",perf:"#facc15",test:"#a3e635",docs:"var(--rel)",ci:"var(--muted)",chore:"var(--muted)",build:"var(--muted)",style:"var(--muted)",revert:"var(--warn)"};
  const R=[
    {l:"main",h:"e41b7d2",m:"chore(release): 1.5.0 [skip ci]",tag:"v1.5.0"},
    {l:"main",h:"9c03a1f",m:"Merge pull request #142 from feature/SHOP-142-cart-promo-code",merge:true},
    {l:"feat",h:"5d2e8b0",m:"test(cart): cover promo code validation"},
    {l:"main",h:"77af3c4",m:"Merge pull request #151 from hotfix/1.4.1-payment-timeout",merge:true,tag:"v1.4.1"},
    {l:"hot", h:"b18f6e9",m:"fix(payment): retry request on gateway timeout"},
    {l:"feat",h:"c4a9e12",m:"refactor(cart): extract usePromoCode hook"},
    {l:"feat",h:"0f6d3ab",m:"feat(cart): add promo code field"},
    {l:"main",h:"3e8c5a7",m:"chore(release): 1.4.0 [skip ci]",tag:"v1.4.0"},
    {l:"main",h:"a29d4f1",m:"ci: cache npm dependencies in GitHub Actions"},
    {l:"main",h:"1b7e0c3",m:"chore: init project with Vite + React"},
  ];
  const y=i=>T+i*RH, P=(d,c,w=2.5)=>L.append(el("path",{d,fill:"none",stroke:c,"stroke-width":w,"stroke-linecap":"round"}));
  const curve=(x1,y1,x2,y2)=>`M${x1} ${y1} C${x1} ${(y1+y2)/2} ${x2} ${(y1+y2)/2} ${x2} ${y2}`;
  // lanes
  P(`M${X.main} ${y(0)} V${y(9)}`,"var(--main)");
  P(`M${X.feat} ${y(2)} V${y(6)}`,"var(--feat)");
  P(curve(X.main,y(8),X.feat,y(6)),"var(--feat)");     // branch feature from row 8
  P(curve(X.feat,y(2),X.main,y(1)),"var(--feat)");     // merge feature into row 1
  P(curve(X.main,y(7),X.hot,y(4)),"var(--fix)");       // hotfix from row 7
  P(curve(X.hot,y(4),X.main,y(3)),"var(--fix)");       // merge hotfix into row 3
  // lane labels
  [["main",X.main,"var(--main)"],["feature/SHOP-142-cart-promo-code",X.feat,"var(--feat)"],["hotfix/1.4.1",X.hot,"var(--fix)"]];
  const lab=(t,x,yy,c)=>{const e=el("text",{x,y:yy,fill:c,"font-family":"JetBrains Mono, monospace","font-size":9});e.textContent=t;L.append(e)};
  const LC={main:"var(--main)",feat:"var(--feat)",hot:"var(--fix)"};
  R.forEach((r,i)=>{
    const g=el("g",{class:"row",tabindex:0,role:"button","aria-label":"Скопировать: "+r.m});g.dataset.copy=r.m;
    g.append(el("rect",{class:"hl",x:100,y:y(i)-10,width:636,height:20,rx:3,fill:"transparent"}));
    g.append(el("circle",{cx:X[r.l],cy:y(i),r:r.merge?6:5,fill:r.merge?LC[r.l]:"var(--sheet)",stroke:LC[r.l],"stroke-width":2.5}));
    const tx=el("text",{x:108,y:y(i)+3.5,"font-family":"JetBrains Mono, monospace","font-size":10.5});
    const ts=(t,a)=>{const e=el("tspan",a);e.textContent=t;tx.append(e);return e};
    ts(r.h+"  ",{fill:"var(--muted)"});
    const m=r.m.match(/^(\w+)(\([^)]*\))?(!)?:\s(.*)$/);
    if(m){
      ts(m[1],{fill:TC[m[1]]||"var(--fg)","font-weight":700});
      if(m[2])ts(m[2],{fill:"var(--rel)"});
      if(m[3])ts("!",{fill:"var(--warn)"});
      ts(": "+m[4],{fill:"var(--fg)"});
    } else ts(r.m,{fill:"var(--muted)"});
    g.append(tx);
    if(r.tag){
      const w=r.tag.length*6.4+12, bx=736-w;
      g.append(el("rect",{x:bx,y:y(i)-8,width:w,height:16,rx:3,fill:"none",stroke:"var(--tag)","stroke-width":1}));
      const t=el("text",{x:bx+6,y:y(i)+3.5,fill:"var(--tag)","font-family":"JetBrains Mono, monospace","font-size":9.5,"font-weight":700});t.textContent=r.tag;g.append(t);
    }
    L.append(g);
  });
})();

// generic copy for sheet 2
function copyText(t){try{navigator.clipboard.writeText(t).then(()=>show("Скопировано: "+t.split("\n")[0]),()=>show(t.split("\n")[0]))}catch(_){show(t.split("\n")[0])}}
document.getElementById("log").addEventListener("click",e=>{const g=e.target.closest(".row");if(g)copyText(g.dataset.copy)});
document.getElementById("log").addEventListener("keydown",e=>{const g=e.target.closest(".row");if(g&&(e.key==="Enter"||e.key===" ")){e.preventDefault();copyText(g.dataset.copy)}});
document.querySelectorAll(".ex-list .e.ok").forEach(e=>{const go=()=>copyText(e.querySelector("span").textContent);e.addEventListener("click",go);e.addEventListener("keydown",k=>{if(k.key==="Enter"||k.key===" "){k.preventDefault();go()}})});
const fm=document.getElementById("fullmsg");fm.addEventListener("keydown",k=>{if(k.key==="Enter"){k.preventDefault();fm.click()}});
fm.addEventListener("click",()=>{
  const t=[...document.getElementById("fullmsg").childNodes].filter(n=>!(n.classList&&(n.classList.contains("lbl")||n.classList.contains("cm")))).map(n=>n.textContent).join("").replace(/\n{3,}/g,"\n\n").trim();
  copyText(t);
});

// Filter + search
let F="all";const q=document.getElementById("q");
function apply(){
  const s=q.value.trim().toLowerCase();
  document.querySelectorAll(".sec").forEach(sec=>{
    let any=false;
    sec.querySelectorAll(".cmd").forEach(b=>{
      const c=b._c,okF=F==="all"||c.t===F,okS=!s||(c.c+" "+c.d+" "+(c.x||"")).toLowerCase().includes(s);
      b.hidden=!(okF&&okS);if(!b.hidden)any=true;
    });
    sec.querySelectorAll(".pair").forEach(p=>p.hidden=F!=="all"||!!s);
    sec.hidden=!any;
  });
}
document.querySelectorAll(".seg button").forEach(b=>b.addEventListener("click",()=>{
  F=b.dataset.f;document.querySelectorAll(".seg button").forEach(x=>x.setAttribute("aria-pressed",x===b));apply();
  try{localStorage.setItem("gitcs-f",F)}catch(_){}
}));
q.addEventListener("input",apply);
try{const s=localStorage.getItem("gitcs-f");if(s){document.getElementById("f-"+s)?.click()}}catch(_){}
