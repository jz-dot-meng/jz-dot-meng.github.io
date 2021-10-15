let contScroll=0;

window.addEventListener('scroll', () => {
  contScroll+=50;
  document.documentElement.style.setProperty('--scroll',(contScroll%(document.body.offsetHeight - window.innerHeight)) / (document.body.offsetHeight - window.innerHeight));
}, false);
