function toggleTheme() {
  const body = document.body;
  const nextTheme = body.classList.contains('light-theme') ? 'dark' : 'light';
  body.classList.toggle('light-theme', nextTheme === 'light');
  try {
    localStorage.setItem('rtp-theme', nextTheme);
  } catch (error) {
    // Ignore storage failures in static preview environments.
  }
}

(function initTheme() {
  try {
    const stored = localStorage.getItem('rtp-theme');
    if (stored === 'light') {
      document.body.classList.add('light-theme');
    }
  } catch (error) {
    // Ignore storage failures in static preview environments.
  }
})();
