# MSI Product Scraper

A production-style web scraper for the MSI MAG Z890 TOMAHAWK WIFI product page.
Built with Node.js and Playwright.

## Stack

- Node.js
- JavaScript
- Playwright

## Project Structure

msi-product-scraper/
src/
scrape.js
output/
product.json
package.json
README.md

## Installation

1. Clone the repository:
   git clone https://github.com/Andrusway/msi-product-scraper.git
   cd msi-product-scraper

2. Install dependencies:
   npm install

3. Install Playwright browser:
   npx playwright install chromium

## Usage

npm run scrape

The result will be saved to `output/product.json`.

## Output

The scraper extracts the following fields from the live page:

| Field                 | Type           | Description                         |
| --------------------- | -------------- | ----------------------------------- |
| url                   | string         | Final product page URL              |
| item_id               | string or null | Product ID                          |
| title                 | string or null | Product title                       |
| brand                 | string or null | Brand name                          |
| product_category      | string or null | Category path                       |
| category_tree         | array          | Breadcrumb entries                  |
| description           | string or null | Product description                 |
| price                 | number or null | Regular price                       |
| sale_price            | number or null | Discounted price                    |
| availability          | string or null | in_stock / out_of_stock / pre_order |
| image_url             | string or null | Main product image                  |
| additional_image_urls | array          | Additional images                   |
| specs                 | array          | Technical specifications            |
| star_rating           | number or null | Average rating                      |
| review_count          | number or null | Number of reviews                   |
| gtin                  | string or null | GTIN/UPC                            |
| mpn                   | string or null | Manufacturer part number            |
| scraped_at            | string         | ISO 8601 datetime                   |

## Notes

- Prices are normalized to numbers — for example `$239.99` becomes `239.99`
- Missing fields are set to `null`
- Empty list fields use `[]`
- The scraper uses `domcontentloaded` with an additional 5 second wait to handle dynamic content
