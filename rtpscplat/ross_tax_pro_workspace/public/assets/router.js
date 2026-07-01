document.addEventListener('DOMContentLoaded', function () {
    var current = window.location.pathname.split('/').pop() || 'index.xhtml';
    var links = document.querySelectorAll('[data-route]');
    for (var i = 0; i < links.length; i++) {
        if (links[i].getAttribute('data-route') === current) {
            links[i].classList.add('active');
        }
    }
});
