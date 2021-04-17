window.addEventListener('scroll', () => {
  document.documentElement.style.setProperty('--scroll',window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
}, false);
