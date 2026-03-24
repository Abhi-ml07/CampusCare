// Site JS: navbar scroll, mobile toggle, smooth anchors, small form helpers
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    var navbar = document.querySelector('.navbar');

    function updateNavbar(){
      if(!navbar) return;
      if(window.scrollY > 20) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }

    updateNavbar();
    window.addEventListener('scroll', updateNavbar, {passive:true});

    // Mobile nav toggle (works if you add an element with .nav-toggle)
    var navToggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');
    if(navToggle && navLinks){
      navToggle.addEventListener('click', function(e){
        e.stopPropagation();
        navLinks.classList.toggle('open');
        navToggle.classList.toggle('open');
      });
      // close when clicking outside
      document.addEventListener('click', function(ev){
        if(!navLinks.contains(ev.target) && !navToggle.contains(ev.target)){
          navLinks.classList.remove('open');
          navToggle.classList.remove('open');
        }
      });
    }

    // Smooth internal anchor scrolling
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click', function(e){
        var href = a.getAttribute('href');
        if(href.length>1){
          var target = document.querySelector(href);
          if(target){
            e.preventDefault();
            target.scrollIntoView({behavior:'smooth',block:'start'});
            history.replaceState(null,'',href);
          }
        }
      });
    });

    // Small convenience: mark forms with data-validate to perform basic required checks
    document.querySelectorAll('form[data-validate]').forEach(function(form){
      form.addEventListener('submit', function(e){
        var valid = true;
        form.querySelectorAll('[required]').forEach(function(inp){
          if(!inp.value.trim()){
            inp.classList.add('error');
            valid = false;
          } else {
            inp.classList.remove('error');
          }
        });
        if(!valid){
          e.preventDefault();
          // small focus to first invalid
          var first = form.querySelector('.error');
          if(first) first.focus();
        }
      });
    });
  });
})();