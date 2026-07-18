# WhatsApp-Only Ordering

Ayira currently uses WhatsApp as the storefront's only visible order-submission path. Shopify still owns the cart and its calculated product data, but the theme does not send the customer into Shopify checkout or create a Shopify order.

## Customer flow

1. The customer adds products through Dawn's existing product forms.
2. Shopify's cart remains the source of truth for variants, quantities, prices, discounts, and totals.
3. The customer selects **Order via WhatsApp** from the cart page, cart drawer, or cart notification.
4. `assets/whatsapp-order.js` requests the locale-aware Ajax cart endpoint at `cart.js`.
5. The script creates a WhatsApp message containing product names, variants, quantities, public line-item properties, prices, estimated total, cart URL, and merchant instructions.
6. The browser opens `wa.me` with the encoded message. The merchant and customer finish confirmation manually in WhatsApp.

This flow does not collect payment, reserve inventory, create a Shopify order, or run Shopify checkout. Prices and availability must be confirmed by the merchant before fulfillment.

## Theme settings

The settings are under **Theme settings → Cart**:

| Setting ID | Default | Purpose |
| --- | --- | --- |
| `whatsapp_ordering_enabled` | `true` | Loads the WhatsApp assets and exposes WhatsApp order actions. |
| `whatsapp_order_phone` | Blank | Destination number in international format. Spaces and punctuation are removed by the script. |
| `whatsapp_order_button_label` | `Order via WhatsApp` | Customer-facing action label. |
| `whatsapp_order_message` | Greeting text | Text placed before the cart details. |
| `whatsapp_order_instructions` | Confirmation note | Text placed after the cart details. |
| `enable_shopify_checkout` | `false` | Recovery switch for the original Shopify checkout controls. |

The current destination number is stored in `config/settings_data.json`. For another store or test theme, verify it in the theme editor before testing.

## Native checkout recovery

The original Dawn checkout forms and accelerated checkout controls have not been deleted or commented out. They remain in their original components behind `settings.enable_shopify_checkout`. This is safer than maintaining duplicated commented markup because the recovery path remains executable and can be tested.

To restore Shopify checkout:

1. Open **Theme settings → Cart**.
2. Enable **Shopify checkout controls**.
3. Disable **WhatsApp ordering** if WhatsApp should no longer appear.
4. Test the cart page, cart drawer, cart notification, product dynamic checkout button, and Shopify checkout.

The theme gates the normal storefront entry points, but theme code cannot prevent someone from manually visiting Shopify's `/checkout` route. Store-level controls are required if that route must be inaccessible.

## Ownership and dependencies

- **Shopify:** cart state, prices, discounts, currency, inventory data, and the Ajax Cart API.
- **Dawn:** add-to-cart behavior, cart refreshes, notifications, drawer behavior, and product forms.
- **Ayira:** WhatsApp button presentation, message composition, loading/error feedback, and which order path is visible.

The shared button lives in `snippets/whatsapp-order-button.liquid`. Its behavior and styles live in `assets/whatsapp-order.js` and `assets/whatsapp-order.css`. It is rendered by the Ayira cart, Dawn fallback cart footer, cart drawer, and cart notification.

## Testing checklist

- Confirm the configured phone number opens the correct WhatsApp conversation.
- Test a single product and multiple products with different quantities.
- Test variants and line-item properties.
- Confirm discounted line totals and the estimated total match the cart.
- Confirm the cart page, drawer, and notification all expose the same action.
- Confirm loading, empty-cart, configuration, and network errors are readable.
- Confirm Shopify checkout and dynamic payment buttons are hidden when their recovery setting is disabled.
- Test desktop and mobile browsers, including a device with the WhatsApp app installed.
