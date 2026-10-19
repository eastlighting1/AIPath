const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path'),pub=path.resolve(__dirname,'../public');
for(const lang of ['ko','en']){
 const node={innerHTML:'',classList:{add(){},remove(){}}},events={},focus={isConnected:true,focus(){this.restored=true}},dialogs=[];
 const storage={getItem(){return null},removeItem(){},setItem(){throw Error('denied')}};
 const c={window:{APP_LANG:lang,scrollTo(){},addEventListener:(k,f)=>events[k]=f,confirm(){throw Error('native confirm')}},document:{activeElement:focus,getElementById:()=>node,querySelectorAll:()=>[],body:{appendChild(){}},createElement(){const handlers={},buttons={};const d={innerHTML:'',setAttribute(){},querySelector(s){return buttons[s]||(buttons[s]={addEventListener(k,f){this[k]=f}})},addEventListener(k,f){handlers[k]=f},showModal(){this.open=true},close(){this.open=false},remove(){this.removed=true},handlers,buttons};dialogs.push(d);return d;}},sessionStorage:storage,localStorage:storage,console,URL,location:{href:'https://example.test',replace(){throw Error('unexpected navigation')}},setInterval:()=>1,clearInterval(){}};
 vm.createContext(c);const run=s=>vm.runInContext(s,c);
 run(fs.readFileSync(path.join(pub,lang==='ko'?'data.js':'data-en.js'),'utf8'));run(fs.readFileSync(path.join(pub,'app-'+lang+'.js'),'utf8'));run('getReport=()=>Promise.resolve({url:"x"})');
 run("start(0);answers[0]=exams[0].questions[0].keys.slice();var snapshot=JSON.stringify({answers,questionOrder,deadline});home()");
 assert.equal(dialogs.length,1);assert(dialogs[0].open);run("if(!active||view!=='exam')throw Error('left early')");
 dialogs[0].handlers.cancel({preventDefault(){}});run("if(!active||JSON.stringify({answers,questionOrder,deadline})!==snapshot)throw Error('cancel lost state')");assert(focus.restored);
 run('submit();submit()');assert.equal(dialogs.length,2);assert(dialogs[1].innerHTML.includes('9'));dialogs[1].buttons['[data-modal-cancel]'].click();run("if(!active||lastResult)throw Error('submitted on cancel')");
 run('submit()');dialogs[2].buttons['[data-modal-confirm]'].click();run("if(active||!lastResult)throw Error('not submitted')");
 run('start(0);examCatalog()');dialogs[3].buttons['[data-modal-confirm]'].click();run("if(active||view!=='exams')throw Error('destination lost')");
 run('start(0);home();submit(true)');assert(!dialogs[4].open);run("if(active||!lastResult.expired||siteModal)throw Error('expiry failed')");
 run("changeLanguage(window.APP_LANG==='ko'?'en':'ko')");assert(dialogs[5].open);assert(dialogs[5].innerHTML.includes(lang==='en'?'Language change failed':'언어를 변경하지 못했습니다'));
 dialogs[5].buttons['[data-modal-confirm]'].click();
 run('start(0)');let warned=false;events.beforeunload({preventDefault(){warned=true}});assert(warned);
 const source=fs.readFileSync(path.join(pub,'app-'+lang+'.js'),'utf8');assert(!/\b(?:alert|confirm|prompt)\s*\(/.test(source));
 console.log(lang+': cancel preserves attempt, submit/leave confirmations, duplicate prevention, expiry cleanup, storage error modal and beforeunload verified');
}
