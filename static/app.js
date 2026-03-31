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

    // ===== Admin Dashboard: Search and Filter Functionality =====
    const adminSearchInput = document.getElementById('searchInput');
    const adminStatusFilter = document.getElementById('statusFilter');
    const adminCategoryFilter = document.getElementById('categoryFilter');
    const adminTableBody = document.getElementById('issuesTableBody');

    if (adminTableBody) {
      function filterAdminTable() {
        const searchTerm = adminSearchInput.value.toLowerCase();
        const statusValue = adminStatusFilter.value;
        const categoryValue = adminCategoryFilter.value;
        const rows = adminTableBody.querySelectorAll('.issue-row');

        rows.forEach(row => {
          let show = true;
          if (statusValue && row.dataset.status !== statusValue) {
            show = false;
          }
          if (categoryValue && row.dataset.category !== categoryValue) {
            show = false;
          }
          if (searchTerm) {
            const text = row.textContent.toLowerCase();
            if (!text.includes(searchTerm)) {
              show = false;
            }
          }
          row.style.display = show ? '' : 'none';
        });
      }

      if (adminSearchInput) adminSearchInput.addEventListener('input', filterAdminTable);
      if (adminStatusFilter) adminStatusFilter.addEventListener('change', filterAdminTable);
      if (adminCategoryFilter) adminCategoryFilter.addEventListener('change', filterAdminTable);
    }

    // ===== Register Page: Toggle Student Code Field =====
    const categorySelect = document.getElementById('category');
    const studentCodeDiv = document.getElementById('studentCodeDiv');

    if (categorySelect && studentCodeDiv) {
      function toggleStudentCode() {
        const role = categorySelect.value;
        studentCodeDiv.style.display = (role === 'Student') ? 'block' : 'none';
      }
      categorySelect.addEventListener('change', toggleStudentCode);
      toggleStudentCode(); // Initialize
    }

    // ===== Dashboard: Filter and Sort Functionality =====
    const dashCategoryFilter = document.getElementById('categoryFilter');
    const dashStatusFilter = document.getElementById('statusFilter');
    const dashSortFilter = document.getElementById('sortFilter');
    const dashSearchInput = document.getElementById('searchInput');
    const issuesGrid = document.getElementById('issuesGrid');

    if (issuesGrid) {
      function filterIssues() {
        const categoryValue = dashCategoryFilter.value.toLowerCase();
        const statusValue = dashStatusFilter.value.toLowerCase();
        const sortValue = dashSortFilter.value;
        const searchTerm = dashSearchInput.value.toLowerCase();

        let cards = Array.from(issuesGrid.querySelectorAll('.issue-card'));

        if (categoryValue) {
          cards = cards.filter(card => card.dataset.category.toLowerCase() === categoryValue);
        }
        if (statusValue) {
          cards = cards.filter(card => card.dataset.status.toLowerCase() === statusValue);
        }
        if (searchTerm) {
          cards = cards.filter(card => card.textContent.toLowerCase().includes(searchTerm));
        }

        if (sortValue === 'liked') {
          cards.sort((a, b) => parseInt(b.dataset.likes) - parseInt(a.dataset.likes));
        } else if (sortValue === 'affected') {
          cards.sort((a, b) => {
            const aAffected = parseInt(a.querySelector('.affected-count').textContent) || 0;
            const bAffected = parseInt(b.querySelector('.affected-count').textContent) || 0;
            return bAffected - aAffected;
          });
        }

        issuesGrid.querySelectorAll('.issue-card').forEach(card => {
          card.style.display = 'none';
        });

        cards.forEach(card => {
          card.style.display = 'grid';
        });

        const visibleCards = cards.length;
        if (visibleCards === 0) {
          if (!issuesGrid.querySelector('.empty-state')) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.style.gridColumn = '1 / -1';
            emptyState.innerHTML = `<div class="empty-state-icon">🔍</div><h3>No Issues Match</h3><p>Try adjusting your filters or search terms</p>`;
            issuesGrid.appendChild(emptyState);
          }
        } else {
          const emptyState = issuesGrid.querySelector('.empty-state');
          if (emptyState) emptyState.remove();
        }
      }

      function clearFilters() {
        dashCategoryFilter.value = '';
        dashStatusFilter.value = '';
        dashSortFilter.value = 'recent';
        dashSearchInput.value = '';
        filterIssues();
      }

      if (dashCategoryFilter) dashCategoryFilter.addEventListener('change', filterIssues);
      if (dashStatusFilter) dashStatusFilter.addEventListener('change', filterIssues);
      if (dashSortFilter) dashSortFilter.addEventListener('change', filterIssues);
      if (dashSearchInput) dashSearchInput.addEventListener('input', filterIssues);
      
      // Expose clearFilters globally if needed
      window.clearFilters = clearFilters;
    }
  });
})();