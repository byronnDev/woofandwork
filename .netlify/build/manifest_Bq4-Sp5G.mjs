import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import 'es-module-lexer';
import 'html-escaper';
import 'clsx';
import { n as NOOP_MIDDLEWARE_HEADER, o as decodeKey } from './chunks/astro/server_D0aXAXRg.mjs';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///home/mikel/code/repos/proyectoXabiWeb/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":"[data-astro-image]{width:100%;height:auto;object-fit:var(--fit);object-position:var(--pos);aspect-ratio:var(--w) / var(--h)}[data-astro-image=responsive]{max-width:calc(var(--w) * 1px);max-height:calc(var(--h) * 1px)}[data-astro-image=fixed]{width:calc(var(--w) * 1px);height:calc(var(--h) * 1px)}\n"}],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/enviar-contacto","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/enviar-contacto\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"enviar-contacto","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/enviar-contacto.ts","pathname":"/api/enviar-contacto","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":".cursor[data-astro-cid-tnzwls7f]{display:inline-block;margin-left:2px;animation:blink .75s step-start 0s infinite}@keyframes blink{50%{opacity:0}}.animate-slide-in[data-astro-cid-nlow4r3u]{animation:slideIn 1s ease-out;opacity:0;animation-fill-mode:forwards}.hover-effect[data-astro-cid-nlow4r3u]{transition:transform .3s ease}.hover-effect[data-astro-cid-nlow4r3u]:hover{transform:scale(1.05)}.navbar-burger[data-astro-cid-3ef6ksr2] span[data-astro-cid-3ef6ksr2]{background-color:#f90}html,body{margin:0;width:100%;height:100%;font-family:Inter Tight,sans-serif}#navBarMenu{position:sticky;top:0;z-index:1000;width:100%}.box[data-astro-cid-3xhgqfdj]{transition:transform .3s}.box[data-astro-cid-3xhgqfdj]:hover{transform:scale(1.05)}.animate-slide-in[data-astro-cid-27ns7vku]{animation:slideIn 1s ease-out;opacity:0;animation-fill-mode:forwards}@keyframes slideIn{0%{transform:translate(50px);opacity:0}to{transform:translate(0);opacity:1}}.hover-effect[data-astro-cid-27ns7vku]{transition:transform .3s ease}.hover-effect[data-astro-cid-27ns7vku]:hover{transform:translateY(-10px)}.slider-mask[data-astro-cid-uri3jt2f]{position:relative;overflow:hidden;width:100%;padding:2rem 0}.slider[data-astro-cid-uri3jt2f]{position:relative;overflow:hidden;padding:2rem 0}.slider-track[data-astro-cid-uri3jt2f]{display:flex;animation:scroll 20s linear infinite;position:relative}.slider-item[data-astro-cid-uri3jt2f]{flex:0 0 100%;padding:0 1rem}@media (min-width: 640px){.slider-item[data-astro-cid-uri3jt2f]{flex:0 0 50%}}@media (min-width: 1024px){.slider-item[data-astro-cid-uri3jt2f]{flex:0 0 33.333%}}.slider-mask[data-astro-cid-uri3jt2f]:before,.slider-mask[data-astro-cid-uri3jt2f]:after{content:\"\";position:absolute;top:0;z-index:10;width:15%;height:100%;pointer-events:none}.slider-mask[data-astro-cid-uri3jt2f]:before{left:0;background:linear-gradient(90deg,var(--bg-color, #ffffff) 0%,rgba(255,255,255,0) 100%)}.slider-mask[data-astro-cid-uri3jt2f]:after{right:0;background:linear-gradient(270deg,var(--bg-color, #ffffff) 0%,rgba(255,255,255,0) 100%)}@keyframes scroll{0%{transform:translate(0)}to{transform:translate(-50%)}}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/mikel/code/repos/proyectoXabiWeb/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:src/pages/api/enviar-contacto@_@ts":"pages/api/enviar-contacto.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_Bq4-Sp5G.mjs","/home/mikel/code/repos/proyectoXabiWeb/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_4Cs-9qQN.mjs","/home/mikel/code/repos/proyectoXabiWeb/src/components/ContactoSection.astro?astro&type=script&index=0&lang.ts":"_astro/ContactoSection.astro_astro_type_script_index_0_lang.2k90Kicb.js","/home/mikel/code/repos/proyectoXabiWeb/src/components/Header.astro?astro&type=script&index=0&lang.ts":"_astro/Header.astro_astro_type_script_index_0_lang.D6YzBJbb.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/home/mikel/code/repos/proyectoXabiWeb/src/components/ContactoSection.astro?astro&type=script&index=0&lang.ts","const o=document.querySelector(\"form\"),e=document.getElementById(\"mensaje-respuesta\");o?.addEventListener(\"submit\",async t=>{t.preventDefault();try{const n=new FormData(t.target),a=Object.fromEntries(n),s=await(await fetch(\"/api/enviar-contacto\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify(a)})).json();if(s.success)e.textContent=s.message,e.className=\"notification is-success mt-4\",t.target.reset();else throw new Error(s.message)}catch{e.textContent=\"Error al enviar el mensaje. Por favor, intenta nuevamente.\",e.className=\"notification is-danger mt-4\"}e.classList.remove(\"is-hidden\")});"],["/home/mikel/code/repos/proyectoXabiWeb/src/components/Header.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",()=>{Array.prototype.slice.call(document.querySelectorAll(\".navbar-burger\"),0).forEach(t=>{t.addEventListener(\"click\",()=>{const a=t.dataset.target,e=document.getElementById(a);t.classList.toggle(\"is-active\"),e&&e.classList.toggle(\"is-active\")})})});"]],"assets":["/favicon.svg"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"DBxjsFtQislqP1najBXLES3vMlucJOtdIC5STJ5R6kw="});

export { manifest };
