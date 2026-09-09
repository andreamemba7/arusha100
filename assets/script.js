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

/* Netlify Forms. Fails honestly when opened as a local file rather than
   pretending it received someone's phone number. */
document.querySelectorAll('form[data-netlify]').forEach(f=>{
    f.addEventListener('submit', async e=>{
        e.preventDefault();
        const btn = f.querySelector('button'), title = f.querySelector('h3').textContent;
        btn.disabled = true; btn.textContent = 'Sending…';
        try{
            const res = await fetch('/',{method:'POST',
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                body:new URLSearchParams(new FormData(f)).toString()});
            if(!res.ok) throw new Error(res.status);
            f.innerHTML = '<h3>'+title+'</h3><p class="done">Got it. We will come back to you on the number you gave us.</p>';
        }catch(err){
            btn.disabled = false; btn.textContent = 'Try again';
            let n = f.querySelector('.err');
            if(!n){ n = document.createElement('p'); n.className = 'err'; f.appendChild(n); }
            n.textContent = 'That did not send — this form only works once the page is live on Netlify.';
        }
    });
});