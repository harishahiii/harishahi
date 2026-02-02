# Modern Minimalist Portfolio

A clean, responsive personal portfolio with all sections and a working contact form that sends messages to **harishahi592@gmail.com**.

## Files

- `index.html` — Main page with all sections
- `styles.css` — Modern minimalist theme (teal/coral accents)
- `main.js` — Interactions (sticky nav, filters, carousel, form)
- `contact.php` — PHP mailer (sends form submissions to your email)
- `.htaccess` — Basic PHP settings for shared hosting
- `assets/logo.svg` — Placeholder logo (swap with yours)

## How the contact form works

1. User fills the form and clicks Send.
2. JavaScript validates client-side, then POSTs to `contact.php`.
3. `contact.php` sanitizes inputs, checks a honeypot field, and uses PHP’s `mail()` to send the message to `harishahi592@gmail.com`.
4. The page shows a toast and inline feedback without reloading.

## Local testing

- **PHP server needed** (mail won’t send from static file://).  
  Quick start with PHP built-in server:
  ```bash
  cd d:/private/website/wind
  php -S localhost:8000
  ```
- Open `http://localhost:8000` in your browser.
- Test the form; check your inbox (and spam folder).

## Deploying

- Upload the entire folder to a PHP-enabled host (most shared hosts support PHP).
- Ensure `mail()` works (most hosts allow it; some require SMTP config via `php.ini` or a library like PHPMailer).
- If emails don’t arrive, check:
  - Spam folder
  - Host’s error logs
  - Whether the host requires SMTP authentication

## Customization tips

- Replace placeholder “Your Name” and contact details in `index.html`.
- Swap `assets/logo.svg` with your real logo.
- Add your actual portfolio projects, blog posts, and testimonials.
- For advanced email delivery (attachments, HTML, templates), replace `contact.php` with PHPMailer or similar.

## Security notes

- Form includes a honeypot field to reduce spam.
- All inputs are sanitized before email.
- No sensitive data is exposed client-side.

---

Enjoy your new portfolio! 🚀
