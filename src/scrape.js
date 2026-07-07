const { chromium } = require("playwright");

const URL =
  "https://us-store.msi.com/Motherboards/Intel-Platform-Motherboard/INTEL-Z890/MAG-Z890-TOMAHAWK-WIFI";

async function scrape() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log("Opening page...");

  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(5000);

  console.log("Page loaded!");

  const title = await page.locator("h2.crop-text-2").textContent();
  console.log("Title:", title.trim());

  const salePriceRaw = await page.locator("#prices-new").textContent();
  const price = parseFloat(salePriceRaw.replace("$", ""));
  console.log("Price:", price);

  const priceRaw = await page.locator("#prices-old").textContent();
  const salePrice = parseFloat(priceRaw.replace("$", ""));
  console.log("Sale price:", salePrice);

  const availabilityRaw = await page
    .locator("#prices-wrapper span:last-child")
    .textContent();
  console.log("Availability raw:", availabilityRaw.trim());

  const url = page.url();
  console.log("URL:", url);

  const imageUrl = await page.locator("#imagePopup").getAttribute("src");
  console.log("Image:", imageUrl);

  const scrapedAt = new Date().toISOString();
  console.log("Scraped at:", scrapedAt);

  const breadcrumbItems = await page.locator(".breadcrumb-item").all();
  const categoryTree = [];
  for (const item of breadcrumbItems) {
    const name = await item.textContent();
    const link = await item
      .locator("a")
      .getAttribute("href")
      .catch(() => null);

    if (name.trim() === "Home" || name.trim() === title.trim()) continue;

    categoryTree.push({
      name: name.trim(),
      url: link,
    });
  }

  const productCategory = categoryTree.map((i) => i.name).join(" > ");

  console.log("Category:", productCategory);
  console.log("Category tree:", categoryTree);

  const thumbs = await page.locator("img.product-detail-thumb-bto").all();
  const additionalImageUrls = [];
  for (const thumb of thumbs) {
    popupImg = await thumb.getAttribute("popup_img");

    if (popupImg && !additionalImageUrls.includes(popupImg)) {
      additionalImageUrls.push(popupImg);
    }
  }
  const filteredImages = additionalImageUrls.filter((img) => img !== imageUrl);
  console.log("Additional images:", filteredImages);

  const specRows = await page.locator("th.w-25").all();

  const specs = [];
  for (const row of specRows) {
    const name = await row.textContent();
    const value = await row
      .locator("xpath=following-sibling::td")
      .textContent();

    specs.push({
      name: name.trim(),
      value: value.trim(),
    });
  }

  console.log("Specs:", specs);

  const manufacturerSpec = specs.find((s) => s.name === "Manufacturer Number");
  const itemId = manufacturerSpec ? manufacturerSpec.value : null;
  const mpn = itemId;
  console.log("Item ID:", itemId);

  const brand = "MSI";
  console.log("Brand:", brand);

  const availabilityText = availabilityRaw.trim().toLowerCase();
  let availability = null;
  if (availabilityText.includes("in stock")) availability = "in_stock";
  else if (availabilityText.includes("out of stock"))
    availability = "out_of_stock";
  else if (availabilityText.includes("pre-order")) availability = "pre_order";
  console.log("Availability normalized:", availability);

  const product = {
    url,
    item_id: itemId,
    title: title.trim(),
    brand,
    product_category: productCategory,
    category_tree: categoryTree,
    description: null,
    price,
    sale_price: salePrice,
    availability,
    image_url: imageUrl,
    additional_image_urls: filteredImages,
    specs,
    star_rating: null,
    review_count: null,
    gtin: null,
    mpn,
    scraped_at: scrapedAt,
  };

  const fs = require("fs");
  const path = require("path");
  const outputDir = path.join(__dirname, "..", "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  fs.writeFileSync(
    path.join(outputDir, "product.json"),
    JSON.stringify(product, null, 2),
  );

  console.log("Saved to output/product.json ✅");

  await browser.close();
}

scrape();
