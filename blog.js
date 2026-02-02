// Blog post page interactions: social sharing and toast feedback
document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  if (!toast) return;

  function setToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-visible');
    window.clearTimeout(setToast._t);
    setToast._t = window.setTimeout(() => toast.classList.remove('is-visible'), 2400);
  }

  // Social share buttons
  const shareButtons = document.querySelectorAll('.share-btn');
  shareButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.getAttribute('data-share');
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);

      let shareUrl = '';
      if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
      } else if (platform === 'linkedin') {
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      } else if (platform === 'copy') {
        navigator.clipboard.writeText(window.location.href).then(() => {
          setToast('Link copied to clipboard!');
        }).catch(() => {
          setToast('Failed to copy link');
        });
        return;
      }

      if (shareUrl) {
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
      }
    });
  });
});
