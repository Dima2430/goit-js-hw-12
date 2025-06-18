import{i as n,S as h,a as v}from"./assets/vendor-b42c18af.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function o(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(e){if(e.ep)return;e.ep=!0;const r=o(e);fetch(e.href,r)}})();let l=1,m=0,d="";const p=document.querySelector(".search-form"),u=document.querySelector(".gallery"),g=document.querySelector(".loader"),c=document.querySelector(".load-more");let f;p.addEventListener("submit",async t=>{if(t.preventDefault(),d=t.target.elements.query.value.trim(),!d){n.error({title:"Error",message:"Please enter a search term.",position:"topRight"});return}g.style.display="block",u.innerHTML="",y(),p.reset()});c.addEventListener("click",async t=>{y()});function b(t){const s={key:"42392659-652aaf55959599f1a779f61b5",q:t,image_type:"photo",orientation:"horizontal",safeSearch:!0,per_page:20,page:l};return v.get("https://pixabay.com/api/",{params:s})}function L({largeImageURL:t,tags:s,webformatURL:o,likes:a,views:e,comments:r,downloads:i}){return`
    <a href="${t}" class="gallery-link">
      <figure>
        <img src="${o}" alt="${s}" class="gallery-image">
        <figcaption class="gallery__figcaption">
          <div class="image-item">Likes <span class="image-elem">${a}</span></div>
          <div class="image-item">Views <span class="image-elem">${e}</span></div>
          <div class="image-item">Comments <span class="image-elem">${r}</span></div>
          <div class="image-item">Downloads <span class="image-elem">${i}</span></div>
        </figcaption>
      </figure>
    </a>
  `}async function y(){try{const t=await b(d),s=t.data.hits,o=t.data.totalHits;if(l===1&&(m=Math.ceil(o/20)),s.length===0){n.info({title:"Info",message:"No results found.",position:"topRight"}),c.style.display="none";return}u.insertAdjacentHTML("beforeend",s.map(L).join("")),f?f.refresh():f=new h(".gallery a"),l>=m?(c.style.display="none",n.info({title:"Info",message:"No more results to show.",position:"topRight"})):c.style.display="block",l++}catch(t){console.error(t),n.error({title:"Error",message:"Something went wrong. Try again later.",position:"topRight"})}finally{g.style.display="none"}}
//# sourceMappingURL=commonHelpers.js.map
