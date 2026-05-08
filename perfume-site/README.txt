JAVOKHIR ATTOR — STATIC WEBSITE
================================
No server required. Works from any folder, USB drive, or local machine.


HOW TO OPEN THE CATALOG
------------------------
Double-click index.html — the catalog opens in your browser.

NOTE FOR GOOGLE CHROME USERS:
  Chrome may block loading products.json when opening index.html
  directly from a folder or USB drive (a browser security limitation).

  Solutions (choose one):
    A) Use Mozilla Firefox or Microsoft Edge instead — works perfectly.
    B) In Chrome, open a new tab, go to:
         chrome://flags/#allow-file-access-from-files
       Enable the flag, relaunch Chrome, then open index.html.

  The full website — all animations, product cards, hero slideshow —
  works in Firefox with no extra steps at all.


HOW TO MANAGE PRODUCTS (ADMIN)
-------------------------------
Double-click admin.html to open the product manager.
Password: admin123

ADDING / EDITING PRODUCTS
  1. Fill in the form on the left side of the screen.
  2. For the product image, choose one of these options:

     Option A — Relative path (best for USB drive or shared folder):
       a. Copy your image file into the "images" folder.
       b. In the "Product Image" field, type:  images/yourfile.jpg
       c. The image will load correctly on all devices.

     Option B — Embed image directly (simplest, works everywhere):
       a. Click or drag an image file into the upload zone.
       b. The image is saved inside the JSON file automatically.
       c. Note: large images will make products.json bigger.

     Option C — Online image URL:
       a. Paste the full URL into the "Product Image" field:
          https://example.com/path/to/image.jpg

  3. Click "Add Fragrance" (or "Save Changes" when editing).

DELETING PRODUCTS
  Click the "Delete" button on any product card in the right panel.


HOW TO SAVE YOUR CHANGES
--------------------------
The admin panel saves changes to your browser's memory automatically.
To make changes permanent (visible on the main site), you must export:

  1. Click the "↓ Export JSON" button at the top of the product list.
  2. A file named "products.json" will be downloaded.
  3. Move this file into the perfume-site folder, replacing the old one.
  4. Refresh index.html — your changes will appear.

The admin remembers your edits even if you close and reopen the tab
(stored in browser localStorage). Always export before clearing
browser data or switching computers.


HOW TO LOAD PRODUCTS IN ADMIN
-------------------------------
  - In Firefox: products load automatically when you open admin.html.
  - In Chrome (file://): click "↑ Import JSON" and select products.json
    from your perfume-site folder. This works in all browsers.


ADDING INGREDIENT IMAGES (for the spinning orbit animation)
------------------------------------------------------------
  In the admin form, scroll down to "Ingredient Images".
  Click any of the 6 circles to pick a local image file.
  The image is stored directly in the JSON — no server needed.
  Add a label (e.g. "Oud Wood") below each circle.


FOLDER STRUCTURE
-----------------
perfume-site/
  index.html        — Main catalog (open this to view the site)
  admin.html        — Product manager (password: admin123)
  products.json     — Product data (replaced via Export JSON)
  styles.css        — Site styles
  script.js         — Site logic
  README.txt        — This file
  images/           — Product photos
    ingredients/    — Ingredient images for orbit animation


MOVING TO A NEW COMPUTER OR USB DRIVE
---------------------------------------
Copy the entire perfume-site folder as-is.
All image paths are relative, so the site works from any location:
desktop, USB drive, shared network folder — no changes needed.
