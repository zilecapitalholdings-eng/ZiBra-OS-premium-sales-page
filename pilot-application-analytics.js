/* ZiBra sales-page analytics and founding-pilot application connector.
   Add this script after the application form. Required field names are documented below. */
(() => {
"use strict";
const ENDPOINT="https://qzvauqlwkbsiledkfoko.supabase.co/functions/v1/zibra-growth";
const CONSENT_KEY="zibra_analytics_consent_v1",VISITOR_KEY="zibra_visitor_v1",SESSION_KEY="zibra_session_v1";
const params=new URLSearchParams(location.search);
const utm={utm_source:params.get("utm_source")||"",utm_medium:params.get("utm_medium")||"",utm_campaign:params.get("utm_campaign")||"",utm_content:params.get("utm_content")||"",utm_term:params.get("utm_term")||""};
const choice=()=>{try{return localStorage.getItem(CONSENT_KEY)||"";}catch{return "rejected";}};\nconst consent=()=>choice()==="accepted";
function id(){return crypto.randomUUID?crypto.randomUUID():String(Date.now())+"-"+Math.random().toString(36).slice(2);}
function ids(){if(!consent())return {visitor_id:"",session_id:""};let v=localStorage.getItem(VISITOR_KEY),s=sessionStorage.getItem(SESSION_KEY);if(!v){v=id();localStorage.setItem(VISITOR_KEY,v);}if(!s){s=id();sessionStorage.setItem(SESSION_KEY,s);}return {visitor_id:v,session_id:s};}
function source(){let host="";try{host=document.referrer?new URL(document.referrer).hostname:"";}catch{}return { ...utm, ...ids(), page_path:location.pathname+location.hash, referrer_host:host};}
async function track(event_name,metadata={}){if(!consent())return;try{await fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"event",event:{...source(),event_name,metadata}}),keepalive:true});}catch{}}
function consentBanner(){
 if(choice())return;
 const banner=document.createElement("aside");banner.className="zibra-consent-banner";banner.setAttribute("role","region");banner.setAttribute("aria-label","Analytics preferences");
 banner.innerHTML='<div><strong>Help us improve ZiBra</strong><p>Allow privacy-conscious analytics so we can understand how visitors use this page. We do not record keystrokes or passwords. Your pilot application can be submitted whether or not you accept analytics.</p></div><div><button type="button" data-consent="reject">Essential only</button><button type="button" data-consent="accept">Allow analytics</button></div>';
 Object.assign(banner.style,{position:"fixed",zIndex:"99999",left:"16px",right:"16px",bottom:"16px",display:"flex",gap:"18px",alignItems:"center",justifyContent:"space-between",padding:"16px",background:"#14243d",color:"#fff",borderRadius:"14px",boxShadow:"0 12px 40px #0004",font:"13px/1.5 system-ui"});
 banner.querySelector("p").style.cssText="margin:4px 0 0;color:#d3dceb;max-width:680px";
 banner.querySelectorAll("button").forEach(b=>{b.style.cssText="margin:4px;padding:9px 12px;border:1px solid #8ca5c9;border-radius:8px;background:#fff;color:#14243d;font-weight:700;cursor:pointer";b.addEventListener("click",()=>{try{localStorage.setItem(CONSENT_KEY,b.dataset.consent==="accept"?"accepted":"rejected");}catch{}banner.remove();if(b.dataset.consent==="accept"){track("page_view",{section:"landing"});}});});
 document.body.appendChild(banner);
}
function setMessage(form,text,bad=false){const node=form.querySelector("[data-application-message]");if(node){node.textContent=text;node.style.color=bad?"#b42345":"#18734f";}}
function bindForm(){
 const form=document.querySelector("#pilotApplicationForm");if(!form)return;
 form.addEventListener("focusin",()=>track("application_started",{section:"pilot-application"}),{once:true});
 form.addEventListener("submit",async e=>{
  e.preventDefault();const button=form.querySelector('[type="submit"]');if(button?.disabled)return;
  const fd=new FormData(form),value=name=>String(fd.get(name)||"").trim();
  const application={full_name:value("full_name"),business_email:value("business_email"),business_name:value("business_name"),city_state:value("city_state"),business_stage:value("business_stage"),business_type:value("business_type"),current_website:value("current_website"),primary_goal:value("primary_goal"),website:value("website"),...ids(),...utm};
  if(button)button.disabled=true;setMessage(form,"Submitting your application securely…");
  try{
   const res=await fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"application",application})});
   const data=await res.json().catch(()=>({}));
   if(!res.ok)throw Error(data.error||"We could not submit your application. Please try again.");
   form.reset();setMessage(form,"Your application has been received. The ZiBra team will review it and contact you about next steps.");
   form.dispatchEvent(new CustomEvent("zibra:application-submitted",{detail:data.application}));
  }catch(err){setMessage(form,err.message||"Submission failed. Please try again.",true);}
  finally{if(button)button.disabled=false;}
 });
}
document.addEventListener("click",e=>{
 const target=e.target.closest("[data-zibra-event]");if(!target)return;
 const event=target.dataset.zibraEvent;if(event)track(event,{journey:target.dataset.journey||"",section:target.dataset.section||""});
});
document.addEventListener("DOMContentLoaded",()=>{
 consentBanner();bindForm();if(consent())track("page_view",{section:"landing"});
});
window.ZiBraGrowth={track,source,consent};
})();