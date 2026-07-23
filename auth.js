/* Lightweight client-side access gate for VNG Korea Office internal tools.
 * NOTE: This is casual obfuscation only, NOT real security — the repo/data
 * are public. For real access control, move to private hosting + auth.
 * Password is stored as a SHA-256 hash (never plaintext). To change it,
 * replace HASH with sha256(newPassword). Auth persists in localStorage. */
(function () {
  var KEY = "vngko_auth_v1";
  // sha256("vngkorea2026")
  var HASH = "c2afc3b1e3d372aa96556c47d786457184b031b97f99c107bdb4bdcb7ef46f88";

  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}
  if (stored === HASH) return; // already unlocked

  document.documentElement.classList.add("gated");

  var st = document.createElement("style");
  st.textContent =
    "html.gated body{visibility:hidden}" +
    "#vgate{position:fixed;inset:0;z-index:99999;background:linear-gradient(135deg,#ffffff,#fff1ea);display:flex;align-items:center;justify-content:center;font-family:'Pretendard','Malgun Gothic','Segoe UI',system-ui,sans-serif}" +
    ".vgate-box{background:#fff;border:1px solid #e6e8ee;border-radius:16px;box-shadow:0 10px 40px rgba(20,30,60,.12);padding:30px 28px;width:300px;max-width:88vw;text-align:center}" +
    ".vgate-logo{font-weight:900;font-size:30px;letter-spacing:-.06em;color:#ec5e28;line-height:1}" +
    ".vgate-t{font-size:13px;font-weight:700;color:#1f2430;margin-top:3px}" +
    ".vgate-s{font-size:12px;color:#8a92a6;margin:16px 0 8px}" +
    "#vgate-pw{width:100%;padding:10px 12px;border:1px solid #e6e8ee;border-radius:9px;font-size:14px;outline:none;box-sizing:border-box}" +
    "#vgate-pw:focus{border-color:#ec5e28}" +
    "#vgate-go{width:100%;margin-top:10px;padding:10px;border:0;border-radius:9px;background:#ec5e28;color:#fff;font-size:14px;font-weight:700;cursor:pointer}" +
    ".vgate-err{color:#e03131;font-size:12px;margin-top:9px;min-height:14px}";
  (document.head || document.documentElement).appendChild(st);

  async function sha256(s) {
    var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
    return Array.from(new Uint8Array(buf)).map(function (x) { return x.toString(16).padStart(2, "0"); }).join("");
  }

  function build() {
    var ov = document.createElement("div");
    ov.id = "vgate";
    ov.innerHTML =
      '<div class="vgate-box">' +
      '<div class="vgate-logo">VNG</div>' +
      '<div class="vgate-t">Korea Office · 내부 도구</div>' +
      '<div class="vgate-s">비밀번호를 입력하세요</div>' +
      '<input id="vgate-pw" type="password" autocomplete="current-password" placeholder="비밀번호">' +
      '<button id="vgate-go">들어가기</button>' +
      '<div id="vgate-err" class="vgate-err"></div></div>';
    document.documentElement.appendChild(ov);
    var pw = ov.querySelector("#vgate-pw"),
        go = ov.querySelector("#vgate-go"),
        err = ov.querySelector("#vgate-err");
    pw.focus();
    async function submit() {
      var h = await sha256(pw.value);
      if (h === HASH) {
        try { localStorage.setItem(KEY, HASH); } catch (e) {}
        document.documentElement.classList.remove("gated");
        ov.remove();
      } else {
        err.textContent = "비밀번호가 올바르지 않습니다.";
        pw.value = ""; pw.focus();
      }
    }
    go.addEventListener("click", submit);
    pw.addEventListener("keydown", function (e) { if (e.key === "Enter") submit(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
