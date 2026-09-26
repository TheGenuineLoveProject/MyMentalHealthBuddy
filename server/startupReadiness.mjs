// Reports startup completion only; this is not a continuous database health probe.
export function createStartupReadiness({schemaBootstrap,getBillingState=()=> 'disabled'}={}) {
  if(typeof schemaBootstrap!=='function'||typeof getBillingState!=='function')throw TypeError('Invalid readiness dependencies');
  let phase='pending',starting;
  function status(){
    let billing;try{billing=getBillingState();}catch{billing='unavailable';}
    const ready=phase==='ready'&&(billing==='ready'||billing==='disabled');
    return {ok:ready,status:ready?'ready':'not_ready'};
  }
  function start(){
    if(phase==='draining')return Promise.resolve({ok:false});
    if(starting)return starting;
    phase='starting';
    starting=Promise.resolve().then(()=>schemaBootstrap()).then(result=>{
      if(phase!=='draining')phase=result?.ok===true?'ready':'failed';
      return status();
    },()=>{if(phase!=='draining')phase='failed';return status();});
    return starting;
  }
  function stop(){phase='draining';}
  function middleware(req,res,next){
    if(req.method!=='GET'&&req.method!=='HEAD')return next();
    const pathname=String(req.path||'').replace(/\/+$/,'').toLowerCase();
    if(!['/ready','/readyz','/api/ready','/api/readyz'].includes(pathname))return next();
    const result=status();res.set('Cache-Control','no-store');
    if(!result.ok)res.set('Retry-After','5');
    res.status(result.ok?200:503);
    return req.method==='HEAD'?res.end():res.json(result);
  }
  return Object.freeze({start,stop,status,middleware});
}
