let contScroll=0;

window.addEventListener('scroll', () => {
  contScroll++;
  document.documentElement.style.setProperty('--scroll',(contScroll%(document.body.offsetHeight - window.innerHeight)) / (document.body.offsetHeight - window.innerHeight));
}, false);
