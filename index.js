// node_modules/regexparam/dist/index.mjs
function parse(str, loose) {
  if (str instanceof RegExp)
    return { keys: false, pattern: str };
  var c2, o2, tmp, ext, keys = [], pattern = "", arr = str.split("/");
  arr[0] || arr.shift();
  while (tmp = arr.shift()) {
    c2 = tmp[0];
    if (c2 === "*") {
      keys.push("wild");
      pattern += "/(.*)";
    } else if (c2 === ":") {
      o2 = tmp.indexOf("?", 1);
      ext = tmp.indexOf(".", 1);
      keys.push(tmp.substring(1, !!~o2 ? o2 : !!~ext ? ext : tmp.length));
      pattern += !!~o2 && !~ext ? "(?:/([^/]+?))?" : "/([^/]+?)";
      if (!!~ext)
        pattern += (!!~o2 ? "?" : "") + "\\" + tmp.substring(ext);
    } else {
      pattern += "/" + tmp;
    }
  }
  return {
    keys,
    pattern: new RegExp("^" + pattern + (loose ? "(?=$|/)" : "/?$"), "i")
  };
}

// node_modules/worktop/request/index.mjs
function n(e) {
  let r, t, a, o2 = {};
  for ([r, t] of e)
    o2[r] = (a = o2[r]) !== void 0 ? [].concat(a, t) : t;
  return o2;
}
async function i(e, r) {
  if (!(!e.body || !r))
    return ~r.indexOf("application/json") ? e.json() : ~r.indexOf("multipart/form-data") || ~r.indexOf("application/x-www-form-urlencoded") ? e.formData().then(n) : ~r.indexOf("text/") ? e.text() : e.arrayBuffer();
}
function f(e) {
  let r = this, { request: t } = e, a = new URL(t.url);
  return r.url = t.url, r.method = t.method, r.headers = t.headers, r.extend = e.waitUntil.bind(e), r.cf = t.cf, r.params = {}, r.path = a.pathname, r.hostname = a.hostname, r.origin = a.origin, r.query = a.searchParams, r.search = a.search, r.body = i.bind(0, t, r.headers.get("content-type")), r.body.blob = t.blob.bind(t), r.body.text = t.text.bind(t), r.body.arrayBuffer = t.arrayBuffer.bind(t), r.body.formData = t.formData.bind(t), r.body.json = t.json.bind(t), r;
}

// node_modules/worktop/utils/index.mjs
var o = /* @__PURE__ */ new TextEncoder();
function h(r) {
  return r ? o.encode(r).byteLength : 0;
}

// node_modules/worktop/response/index.mjs
var s = "content-type";
var i2 = "content-length";
function h2(u) {
  var e = this, r = e.headers = new Headers({
    "Cache-Control": "private, no-cache"
  });
  return e.body = "", e.finished = false, e.status = e.statusCode = 200, e.getHeaders = () => Object.fromEntries(r), e.getHeaderNames = () => [...r.keys()], e.hasHeader = r.has.bind(r), e.getHeader = r.get.bind(r), e.removeHeader = r.delete.bind(r), e.setHeader = r.set.bind(r), Object.defineProperty(e, "status", {
    set: (n2) => {
      e.statusCode = n2;
    },
    get: () => e.statusCode
  }), e.end = (n2) => {
    e.finished || (e.finished = true, e.body = n2);
  }, e.writeHead = (n2, t) => {
    e.statusCode = n2;
    for (let d2 in t)
      r.set(d2, t[d2]);
  }, e.send = (n2, t, d2) => {
    let a = typeof t, o2 = {};
    for (let p in d2)
      o2[p.toLowerCase()] = d2[p];
    let f2 = o2[i2] || e.getHeader(i2), l2 = o2[s] || e.getHeader(s);
    t == null ? t = "" : a === "object" ? (t = JSON.stringify(t), l2 = l2 || "application/json;charset=utf-8") : a !== "string" && (t = String(t)), o2[s] = l2 || "text/plain", o2[i2] = f2 || String(t.byteLength || h(t)), n2 === 204 || n2 === 205 || n2 === 304 ? (e.removeHeader(i2), e.removeHeader(s), delete o2[i2], delete o2[s], t = null) : u === "HEAD" && (t = null), e.writeHead(n2, o2), e.end(t);
  }, e;
}

// node_modules/worktop/router/index.mjs
var c = {
  "400": "Bad Request",
  "401": "Unauthorized",
  "403": "Forbidden",
  "404": "Not Found",
  "405": "Method Not Allowed",
  "406": "Not Acceptable",
  "409": "Conflict",
  "410": "Gone",
  "411": "Length Required",
  "413": "Payload Too Large",
  "422": "Unprocessable Entity",
  "426": "Upgrade Required",
  "428": "Precondition Required",
  "429": "Too Many Requests",
  "500": "Internal Server Error",
  "501": "Not Implemented",
  "502": "Bad Gateway",
  "503": "Service Unavailable",
  "504": "Gateway Timeout"
};
function m(t) {
  return (o2) => o2.respondWith(t(o2));
}
function w(t) {
  addEventListener("fetch", m(t));
}
var l = false;
async function d(t, o2, s2, r, ...e) {
  let n2 = await t(s2, r, ...e);
  if (n2 instanceof Response)
    return n2;
  if (o2 || r.finished)
    return new Response(r.body, r);
}
function y(t, o2, s2) {
  let r = {}, e, n2, a, i3, p;
  if (n2 = t[o2]) {
    if (e = n2.__s[s2])
      return { params: r, handler: e.handler };
    for ([a, i3] of n2.__d)
      if (p = a.exec(s2), p !== null) {
        if (p.groups !== void 0)
          for (e in p.groups)
            r[e] = p.groups[e];
        else if (i3.keys.length > 0)
          for (e = 0; e < i3.keys.length; )
            r[i3.keys[e++]] = p[e];
        return { params: r, handler: i3.handler };
      }
  }
}
function x() {
  let t, o2 = {};
  return t = {
    add(s2, r, e) {
      let n2 = o2[s2];
      if (n2 === void 0 && (n2 = o2[s2] = {
        __d: new Map(),
        __s: {}
      }), r instanceof RegExp)
        n2.__d.set(r, { keys: [], handler: e });
      else if (/[:|*]/.test(r)) {
        let { keys: a, pattern: i3 } = parse(r);
        n2.__d.set(i3, { keys: a, handler: e });
      } else
        n2.__s[r] = { keys: [], handler: e };
    },
    onerror(s2, r, e, n2) {
      let a = c[e = e || 500], i3 = n2 && n2.message || a || String(e);
      return new Response(i3, { status: e, statusText: a });
    },
    async run(s2) {
      let r, e = new f(s2), n2 = new h2(e.method);
      if (l = !!t.prepare) {
        if (r = await d(t.prepare, false, e, n2), r)
          return r;
        l = false;
      }
      return r = y(o2, e.method, e.path), r ? (e.params = r.params, d(r.handler, true, e, n2).catch((a) => d(t.onerror, true, e, n2, 500, a))) : d(t.onerror, true, e, n2, 404);
    }
  };
}

// src/index.js
var router = new x();
router.add("POST", "/", async (req, res) => {
  let body;
  try {
    body = await req.body();
  } catch (e) {
    console.log(e.message);
  }
  console.log(body);
  res.send(200, body.challenge);
});
w(router.run);
