/* ── Tag chip widget ── */
(function() {
  const tagField = document.getElementById('tag-field');
  const tagsList = document.getElementById('tags-list');
  const tagsHidden = document.getElementById('tags-hidden');
  if (!tagField || !tagsList || !tagsHidden) return;

  let tags = tagsHidden.value ? tagsHidden.value.split(',').filter(Boolean) : [];

  function render() {
    tagsList.innerHTML = '';
    tags.forEach((tag, i) => {
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.innerHTML = tag + ' <button type="button" data-index="' + i + '">&times;</button>';
      tagsList.appendChild(chip);
    });
    tagsHidden.value = tags.join(',');
  }

  tagField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagField.value.trim();
      if (val && !tags.includes(val)) {
        tags.push(val);
        render();
      }
      tagField.value = '';
    }
  });

  tagsList.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const idx = parseInt(e.target.dataset.index);
      tags.splice(idx, 1);
      render();
    }
  });

  render();
})();

/* ── Media slot preview & remove ── */
function previewMediaSlot(input, slotKey, isPhone) {
  const file = input.files[0];
  if (!file) return;

  const preview = document.getElementById('preview-' + slotKey);
  const url = URL.createObjectURL(file);
  const isVideo = file.type.startsWith('video/');

  if (isVideo) {
    preview.innerHTML = '<video src="' + url + '" muted loop playsinline autoplay></video>';
  } else {
    preview.innerHTML = '<img src="' + url + '" alt="Preview" />';
  }

  // Update label text only (keep the input intact)
  const slot = document.getElementById('slot-' + slotKey);
  const uploadLabel = slot.querySelector('.media-slot__upload-btn');
  if (uploadLabel) {
    var icon = uploadLabel.querySelector('i');
    // Set text of label without destroying the input
    var textNode = null;
    uploadLabel.childNodes.forEach(function(n) {
      if (n.nodeType === 3 && n.textContent.trim()) textNode = n;
    });
    if (textNode) textNode.textContent = ' Sostituisci';
  }

  // If marked for removal, un-mark it
  slot.classList.remove('marked-remove');
  const removeInput = document.getElementById('remove-' + slotKey);
  if (removeInput) removeInput.value = '';
}

function toggleRemoveMedia(btn, slotKey) {
  const slot = document.getElementById('slot-' + slotKey);
  const removeInput = document.getElementById('remove-' + slotKey);
  const isMarked = slot.classList.toggle('marked-remove');

  if (isMarked) {
    removeInput.value = '1';
    btn.innerHTML = '<i class="fa-solid fa-rotate-left"></i> Annulla';
    btn.classList.remove('media-slot__remove-btn');
    btn.classList.add('media-slot__undo-btn');
  } else {
    removeInput.value = '';
    btn.innerHTML = '<i class="fa-solid fa-trash"></i> Rimuovi';
    btn.classList.add('media-slot__remove-btn');
    btn.classList.remove('media-slot__undo-btn');
  }
}
