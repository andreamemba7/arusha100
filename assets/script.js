/* Sticky bar: transparent while the hero is under it, solid after.
   An observer on a zero-height sentinel rather than a scroll listener,
   so nothing runs on every frame. */
const nav = document.getElementById('nav');
new IntersectionObserver(
    ([e]) => nav.classList.toggle('stuck', !e.isIntersecting),
    {rootMargin: '-1px 0px 0px 0px', threshold: 1}
).observe(document.getElementById('sentinel'));

/* One animated thing on the page, and only one. */
const words = ['people','streets','work','markets','stories'];
const rot = document.getElementById('rot');
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    let i = 0;
    setInterval(()=>{
        rot.classList.add('out');
        setTimeout(()=>{ i = (i+1) % words.length; rot.textContent = words[i]; rot.classList.remove('out'); }, 450);
    }, 2600);
}

/* 100 slots. Raise CHOSEN as pictures are selected and the row fills. */
const CHOSEN = 0;
document.getElementById('hundred').innerHTML =
    Array.from({length:100},(_,n)=>`<i class="${n<CHOSEN?'on':''}"></i>`).join('');
document.getElementById('count').textContent = CHOSEN + ' of 100 chosen';

/* ── FORMS ─────────────────────────────────────────────────────────
   Vercel has no built-in form handling, so submissions go to
   Web3Forms, which posts them straight to your inbox.

   SETUP (about two minutes):
     1. Go to web3forms.com and enter the email you want submissions at.
     2. They email you an access key. Paste it below.
     3. Redeploy, then send yourself a test from the live URL.

   Until the key is filled in the forms refuse to send and say so,
   rather than swallowing somebody's phone number.                  */
const ACCESS_KEY = "PASTE-YOUR-ACCESS-KEY-HERE";

function say(form, cls, text){
    let n = form.querySelector('.note');
    if(!n){ n = document.createElement('p'); n.className = 'note'; form.appendChild(n); }
    n.className = 'note ' + cls;
    n.textContent = text;
}

document.querySelectorAll('form[data-form]').forEach(f=>{
    f.addEventListener('submit', async e=>{
        e.preventDefault();
        const btn = f.querySelector('button');
        const title = f.querySelector('h3').textContent;

        if(f.querySelector('[name="botcheck"]').value) return;   // bot filled the hidden field

        if(!ACCESS_KEY || ACCESS_KEY.startsWith('PASTE')){
            say(f, 'err', 'Not sent — this form has no access key yet. See the SETUP note in assets/script.js.');
            return;
        }

        const payload = Object.fromEntries(new FormData(f).entries());
        payload.access_key = ACCESS_KEY;
        payload.subject = f.dataset.subject;
        payload.from_name = 'Arusha 100 website';

        btn.disabled = true; btn.textContent = 'Sending…';
        try{
            const res = await fetch('https://api.web3forms.com/submit', {
                method:'POST',
                headers:{'Content-Type':'application/json','Accept':'application/json'},
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if(!data.success) throw new Error(data.message || 'rejected');
            f.innerHTML = '<h3>' + title + '</h3>' +
                '<p class="note done">Got it. We will come back to you on the number you gave us.</p>';
        }catch(err){
            btn.disabled = false; btn.textContent = 'Try again';
            say(f, 'err', 'That did not send. Check your connection and try again, or message us on WhatsApp.');
        }
    });
});
