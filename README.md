# Carpet Decors Ecommerce Website

This is a static ecommerce website for **Carpet Decors**, a premium carpet shopping experience built with plain HTML, CSS, and JavaScript. The project has been split into separate files so the code is easier to read, maintain, and update.

## Project Location

```text
C:\Users\jiya1\Downloads\Ecommerce
```

## File Structure

```text
Ecommerce/
|-- index.html
|-- base.css
|-- sections.css
|-- shop.css
|-- responsive.css
|-- data.js
|-- state.js
|-- views.js
`-- actions.js
```

## File Descriptions

### `index.html`

The main HTML file. It contains the page layout, header, cart drawer, modal, floating buttons, mobile bottom navigation, and script/style references.

### `base.css`

Contains global styles, CSS variables, reset styles, typography, navigation, buttons, layout containers, and reusable base components.

### `sections.css`

Contains styles for major page sections such as the hero area, sale banner, trust section, product cards, offer sections, testimonials, newsletter, and page titles.

### `shop.css`

Contains styles for product detail pages, cart, checkout, tracking, FAQ, drawer, toast messages, modal, mobile bottom navigation, loading skeleton, reveal animations, and empty states.

### `responsive.css`

Contains responsive media queries for tablet and mobile layouts.

### `data.js`

Contains the website data, including:

- Product list
- Navigation items
- Testimonials
- FAQs

### `state.js`

Contains shared app state and helper functions, including:

- Cart state
- Wishlist state
- Compare state
- Selected product state
- Price formatting
- Cart totals
- Local storage saving

### `views.js`

Contains functions that render the website interface, including:

- Home page
- Shop page
- Product page
- Cart page
- Checkout page
- Offers page
- Tracking page
- FAQ page
- About page
- Contact page

### `actions.js`

Contains user interaction logic, including:

- Add to cart
- Remove item
- Change quantity
- Wishlist toggle
- Product comparison
- Coupon apply
- Cart drawer open/close
- Product gallery selection
- Checkout simulation
- WhatsApp link
- Countdown timer
- Toast notifications

## How To Run

No installation is required because this is a static website.

Open this file in your browser:

```text
C:\Users\jiya1\Downloads\Ecommerce\index.html
```

You can double-click `index.html`, or open it from your browser using **File > Open**.

## Script And Style Load Order

The CSS files are loaded in this order:

```html
<link rel="stylesheet" href="base.css">
<link rel="stylesheet" href="sections.css">
<link rel="stylesheet" href="shop.css">
<link rel="stylesheet" href="responsive.css">
```

The JavaScript files are loaded in this order:

```html
<script src="data.js"></script>
<script src="state.js"></script>
<script src="views.js"></script>
<script src="actions.js"></script>
```

This order is important because later files depend on variables and functions from earlier files.

## Features

- Responsive ecommerce homepage
- Product listing and filtering
- Product detail page with gallery, size, and color selection
- Shopping cart drawer
- Cart page and checkout simulation
- Wishlist count
- Compare shortlist
- Coupon code support
- Order tracking simulation
- FAQ accordion
- Exit offer modal
- Toast notifications
- Countdown sale timer
- WhatsApp contact button

## Coupon Code

Use this coupon code in the cart or checkout:

```text
CARPET40
```

## Notes For Editing

- Add or update products in `data.js`.
- Change colors, fonts, and global spacing in `base.css`.
- Change homepage and product section layouts in `sections.css`.
- Change cart, checkout, modal, and product detail styling in `shop.css`.
- Change mobile/tablet behavior in `responsive.css`.
- Update page HTML templates in `views.js`.
- Update click behavior and app interactions in `actions.js`.

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage`

## Current Status

The project is ready to run as a static website. No backend, database, or build tools are required.
