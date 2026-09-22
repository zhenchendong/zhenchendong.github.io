const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const toggle = document.querySelector('#motion-toggle');
const videos = [...document.querySelectorAll('video.demo')];
let paused = motion.matches;
let revision = 0;

async function updateMotion() {
  const current = ++revision;
  toggle.textContent = paused ? 'Play animations' : 'Pause animations';
  toggle.setAttribute('aria-pressed', String(paused));
  if (paused || document.hidden) {
    videos.forEach(video => video.pause());
    return;
  }
  const results = await Promise.allSettled(videos.map(video => {
    video.muted = true;
    return video.play();
  }));
  if (current !== revision) return;
  if (results.some(result => result.status === 'rejected')) {
    paused = true;
    videos.forEach(video => {video.pause(); video.controls = true;});
    toggle.textContent = 'Play animations';
    toggle.setAttribute('aria-pressed', 'true');
  } else {
    videos.forEach(video => {video.controls = false;});
  }
}
toggle.hidden = false;
toggle.addEventListener('click', () => {paused = !paused; updateMotion();});
motion.addEventListener('change', event => {paused = event.matches; updateMotion();});
document.addEventListener('visibilitychange', updateMotion);
updateMotion();
