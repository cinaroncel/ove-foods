# CONTENT MODEL — Schemas & Editorial Rules

> Matches the PRD §7, expanded with validations and examples.

## 1) Shared Fields (All Documents)

* **slug** (REQ; auto from title; unique)
* **seo**: title (≤ 60 chars), description (≤ 155), ogImage
* **publishStatus**: draft / scheduled / published
* **timestamps**: createdAt, updatedAt
* **alt text** required for all images

## 2) Category

* **name** (REQ), **slug** (REQ)
* description (≤ 240 chars)
* heroImage
* order (int, defaults to 100)

### Example

```json
{
  "name": "Olive Oils",
  "slug": "olive-oils",
  "description": "Extra virgin and classic olive oils for everyday cooking.",
  "order": 10
}
```

## 3) Product

* **title** (REQ), **slug** (REQ)
* **category** (REF Category, REQ)
* shortCopy (≤ 160 chars)
* longCopy (rich)
* images\[] (1–6; alt required)
* specs: volume (ml), variety, origin, acidity? (optional)
* nutrition: (optional) facts table or image
* certifications\[]: { label, icon }
* awards\[]: { name, year, link? }
* relatedRecipes\[] (REF Recipe, up to 6)
* retailerLinks\[]: { label, url }

### Validation

* title unique within category
* at least 1 image
* retailerLinks max 10

## 4) Recipe

* **title**, **slug**
* heroImage
* description (≤ 200 chars)
* ingredients\[]: { item, quantity (number), unit (string), notes? }
* steps\[]: ordered rich text blocks
* times: prep (min), cook (min)
* servings (int)
* tags\[]: dietary (vegan, gluten-free), difficulty (easy/med/hard)
* relatedProducts\[]

### Example Ingredient

```json
{ "item": "OVE Extra Virgin Olive Oil", "quantity": 2, "unit": "tbsp" }
```

## 5) StoryPost / SustainabilityPost

* **title**, **slug**, coverImage
* body\[] (rich), badges\[] {label, icon?}
* optional resources\[] {label, url}

## 6) Location

* **type**: HQ/Factory/Office
* **name**, **address** { street, city, region, postal, country }
* phone, email, hours
* map: lat, lng or staticMapUrl

## 7) Page (Generic)

* **title**, **slug**
* sections\[] (blocks): hero, richText, imageGrid, stats, contact, custom

## 8) Editorial Workflow

* Draft → Preview → Publish (schedule supported).
* Image sizes: 1600×900 hero, 1200×1200 card, 800×600 inline.
* Alt text required or publish blocked.
* SEO checker: warn if missing title/description.

## 9) JSON‑LD Mapping

* Product → `@type: Product`, `name`, `image`, `description`, `brand`, `offers` (if any).
* Recipe → `@type: Recipe`, `name`, `image`, `description`, `recipeIngredient`, `recipeInstructions`, `totalTime`, `recipeYield`.
* Organization → site‑wide org snippet in layout.
* BreadcrumbList → on detail pages.

## 10) Localization (optional)

* Localized fields: title, description, longCopy, steps, ingredients.
* Media variants allowed per locale.
