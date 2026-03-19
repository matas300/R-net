/* ── Gallery: detect orientation + lightbox (supports images & video) ── */
(function() {
  // Collect all clickable gallery items (legacy grid + new media showcase)
  var items = document.querySelectorAll('.gallery-grid__item, .media-showcase__item--phone, .media-showcase__item--web');
  if (!items.length) return;

  // Detect orientation for legacy grid items
  document.querySelectorAll('.gallery-grid__item').forEach(function(item) {
    var img = item.querySelector('img');
    if (!img) return;
    function classify() {
      var ratio = img.naturalWidth / img.naturalHeight;
      item.classList.add(ratio < 0.85 ? 'is-portrait' : 'is-landscape');
    }
    if (img.complete && img.naturalWidth) classify();
    else img.addEventListener('load', classify);
  });

  // Build lightbox
  var lb = document.createElement('div');
  lb.className = 'gallery-lightbox';
  lb.innerHTML =
    '<button class="lb-close" aria-label="Chiudi">&times;</button>' +
    '<button class="lb-nav lb-prev" aria-label="Precedente"><i class="fa-solid fa-chevron-left"></i></button>' +
    '<div class="lb-content"></div>' +
    '<button class="lb-nav lb-next" aria-label="Successiva"><i class="fa-solid fa-chevron-right"></i></button>';
  document.body.appendChild(lb);

  var lbContent = lb.querySelector('.lb-content');
  var currentIdx = 0;
  var mediaList = []; // { type: 'img'|'video', src: '...' }

  items.forEach(function(item, i) {
    var video = item.querySelector('video');
    var img = item.querySelector('img');
    if (video) {
      mediaList.push({ type: 'video', src: video.src });
    } else if (img) {
      mediaList.push({ type: 'img', src: img.src });
    }
    item.addEventListener('click', function() {
      currentIdx = i;
      openLightbox();
    });
  });

  function showMedia() {
    var m = mediaList[currentIdx];
    if (m.type === 'video') {
      lbContent.innerHTML = '<video src="' + m.src + '" controls autoplay loop muted playsinline style="max-width:92vw;max-height:90vh;border-radius:var(--radius-lg);box-shadow:0 20px 80px rgba(0,0,0,.6)"></video>';
    } else {
      lbContent.innerHTML = '<img src="' + m.src + '" alt="" style="max-width:92vw;max-height:90vh;border-radius:var(--radius-lg);box-shadow:0 20px 80px rgba(0,0,0,.6);object-fit:contain" />';
    }
  }

  function openLightbox() {
    showMedia();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    lbContent.innerHTML = '';
  }

  function navigate(dir) {
    currentIdx = (currentIdx + dir + mediaList.length) % mediaList.length;
    showMedia();
  }

  lb.querySelector('.lb-close').addEventListener('click', function(e) {
    e.stopPropagation();
    closeLightbox();
  });
  lb.querySelector('.lb-prev').addEventListener('click', function(e) {
    e.stopPropagation();
    navigate(-1);
  });
  lb.querySelector('.lb-next').addEventListener('click', function(e) {
    e.stopPropagation();
    navigate(1);
  });
  lb.addEventListener('click', function(e) {
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener('keydown', function(e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'ArrowLeft') navigate(-1);
  });
})();
