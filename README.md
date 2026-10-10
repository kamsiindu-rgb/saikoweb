# SAIKO — @NTI NORMAL

Website for **SAIKO by EYXS**: a streetwear and art label made for the misunderstood & unafraid.

It's a static site: plain HTML, CSS and JavaScript, with no build step and no backend. Orders are placed over WhatsApp.

---

## Pages

| Page | File | What's on it |
|---|---|---|
| Home | `index.html` | Glitching SAIKO logo, a mascot "mugshot" whose eye follows the cursor, the manifesto, the main nav, a visitor-pass QR code and scrolling warning tapes |
| Store | `store.html` | **Collection X-1**: all products, size pickers and add to cart |
| Lookbook | `lookbook.html` | EY3S X ART collection preview stills |
| Gallery & Story | `gallery.html` | Pinned polaroid "evidence wall" and the brand story as a redacted patient statement |
| Coming Soon | `coming-soon.html` | Blurred **CLASSIFIED** upcoming pieces |
| Contact | `contact.html` | Contact form (opens the visitor's email app) and a direct WhatsApp button |

## Features

**Store and checkout**
- Products are rendered from a single list in `js/saiko.js`, so the card, the cart and the order message can't disagree.
- Prices are in naira (₦). A product with `price: null` shows **"Price on request"**.
- Clothing has an S–XXL size picker. Adding an item without picking a size shakes the picker and asks for one.
- Sold-out items get a **CONFISCATED** stamp and a disabled button.
- The cart lets visitors change quantities, and adding the same item and size again bumps the quantity.
- The cart is saved in the browser (`localStorage`), so it follows the visitor between pages and survives a refresh.
- **Checkout via WhatsApp** opens a chat pre-filled with every item, its size, quantity and price, plus the total.
- Clicking any product, lookbook or gallery image opens a full-screen zoom. Esc closes it.

**Look and feel**
- Psych-ward "case file" theme: black, bone, blood red and gold; Anton, Space Mono and Permanent Marker fonts.
- Film grain, scanlines, glitching titles, scrolling warning tapes, nav text that scrambles on hover, and a random page "flicker" every 5–11 seconds.
- The home mascot's pupil tracks the mouse. On phones it darts around on its own, and it turns red and dilates when you hover the nav.
- Responsive down to phone width.
- Visitors with **reduced motion** turned on in their device settings get the site with all animation switched off.

## Project structure

```
index.html  store.html  lookbook.html  gallery.html  coming-soon.html  contact.html
css/saiko.css   all styles, shared by every page (sections are labelled HOME, STORE, LOOKBOOK, …)
js/saiko.js     shared by every page: settings, product list, cart, checkout, zoom, contact form, effects
js/home.js      home page only: the eye, the agitation and the QR code
img/            product, lookbook and gallery images
```

The cart button, cart drawer and image-zoom overlay are added to every page by `js/saiko.js`, so they don't appear in the HTML files.

## Running it locally

Open `index.html` in a browser, or use VS Code's **Live Server** extension (the project is set to port 5501).

---

## How to make common edits

### Add, change or remove a product
Edit the `products` list near the top of `js/saiko.js`. Each product is one line:

```js
{ id: 'crop-hoodie', name: 'CROP HOODIE', price: 14000, image: 'img/crop hoodie.jpeg', sizes: CLOTHING_SIZES },
```

| Field | Meaning |
|---|---|
| `id` | Unique and permanent. Saved carts use it, so **don't rename it** once the site is live. |
| `name` | Shown on the card and in the WhatsApp order. |
| `price` | Naira, as a plain number (`14000`, not `"₦14,000"`). Use `null` for "Price on request". |
| `image` | Path to the photo in `img/`. |
| `sizes` | `CLOTHING_SIZES` (S–XXL), your own list such as `['S', 'M', 'L']`, or leave it out for one-size items like hats and prints. |
| `soldOut` | Add `soldOut: true` to stamp it CONFISCATED and disable buying. |

The store page updates automatically. Also update the **"Exhibits: 15"** count in `store.html`.

### Change the WhatsApp number or contact email
At the very top of `js/saiko.js`:

```js
const WHATSAPP_NUMBER = '2348162921153'; // digits only: country code + number, no "+" or spaces
const CONTACT_EMAIL = 'your-email@example.com';
```

The **Message on WhatsApp** button in `contact.html` has the number written into its link too, so change it there as well.

### Change the nav, header or footer
These are written into each of the six HTML files, so an edit to one has to be repeated in the others. The home page nav is in `index.html` (`.sk-nav`); the inner pages share the `.site-head` header.

### Change colours or fonts
The colours are defined once, at the top of `css/saiko.css`, under `:root` (`--red`, `--gold`, `--bone`, …). The fonts are loaded from Google Fonts in each page's `<head>`.

### Change the slogans on the warning tapes
Edit the text inside `.tape-track` on each page. Write the phrase out twice, because the scrolling loop needs two copies.

---

## Future edits / to do

**Needs fixing before launch**
- [ ] **Contact email:** `CONTACT_EMAIL` is still a placeholder, so the contact form sends nowhere real.
- [ ] **Newsletter:** the Subscribe button does nothing yet. Connect it to a mailing service (e.g. Mailchimp, ConvertKit or Formspree), or remove it.
- [ ] **Footer links:** "Shipping & Returns" and "Privacy Policy" link to `#`. Write those pages or remove the links.
- [ ] **Leather jacket:** the BLANK SAIKO SKULL LEATHER JACKET has no naira price yet (it shows "Price on request").
- [ ] **Check guessed details:** the second hat listing is assumed to be the **SAIKO BASEBALL CAP** at ₦8,500, and every clothing item offers S–XXL.

**Performance**
- [ ] Compress the large photos: `tank2.jpeg`, `tank3.jpeg` and `Jersey2.jpeg` are about 2 MB each, and the whole `img/` folder is about 9 MB. Aim for under ~200 KB per image (e.g. with squoosh.app) or convert to WebP.
- [ ] Remove images that aren't used anywhere, or put them to use: `03.jpeg` and `Hawk.jpeg` are two examples.

**Content**
- [ ] Give the gallery polaroids their own captions; four of them currently say "Original Vision".
- [ ] Settle on one brand spelling: the site uses EYXS, EY3S, "EY3S le ART" and "EYXS of the gods".
- [ ] Update the footer year (© 2024).
- [ ] Add a real drop date on Coming Soon when there is one.
- [ ] Add social links (Instagram, TikTok, etc.).

**Ideas**
- [ ] Stock tracking per size (e.g. "only 2 left in L").
- [ ] Product detail pages with several photos per item.
- [ ] Online card payment (e.g. Paystack or Flutterwave) alongside WhatsApp checkout.
- [ ] Share preview tags (Open Graph image and description) so links look good on WhatsApp and Instagram.
- [ ] A custom 404 page in the same style.
- [ ] Deploy to a free static host (Netlify, Vercel or GitHub Pages); the home page QR code then points at the live site automatically.
