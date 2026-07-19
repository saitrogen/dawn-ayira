# Shopify COD with WhatsApp confirmation

Ayira uses Shopify checkout as the only order-creation path. Shopify owns customer and delivery details, delivery eligibility, inventory, totals, and the order record. Cash on delivery is configured as the only payment method. WhatsApp is an optional post-order confirmation channel and does not replace checkout.

## Customer flow

1. The customer adds products through Dawn product forms and reviews the Ayira cart.
2. The cart's **Check out** action opens Shopify checkout.
3. Shopify collects or reuses the customer's contact and delivery address, validates available delivery options, and presents Cash on Delivery.
4. Shopify creates the order as unpaid and applies its normal inventory and order-management behavior.
5. A Thank-you or Order Status extension presents **Confirm order on WhatsApp**.
6. The customer reviews the prefilled message and explicitly sends it in WhatsApp.

The Shopify order remains valid if the customer does not send the optional WhatsApp confirmation.

## Shopify Admin configuration

Payment and delivery rules are store configuration, not theme code.

### Payments

In **Settings → Payments**:

1. Activate **Cash on Delivery (COD)** as a manual payment method.
2. Add the instructions displayed after checkout.
3. Deactivate card gateways, PayPal, additional payment methods, and accelerated payment methods that the store does not accept.
4. Place a test order and confirm that COD is the only checkout payment choice.

Hiding a payment method with theme CSS is not an enforcement mechanism. The provider must be deactivated in Shopify Admin.

COD orders remain unpaid until staff collects the cash and marks the order paid. Staff should confirm the order before fulfillment, cancel and restock rejected orders, and record the store's cancellation policy and confirmation timeout.

### Delivery

In **Settings → Shipping and delivery**, maintain the fulfilling location, stocked inventory, local-delivery radius or postcodes, rates, minimum order rules, shipping profiles, and customer instructions. Remove ordinary shipping rates if the store must never deliver outside the local area. Shopify checkout is the enforcement point. The theme does not keep a duplicate municipality list, radius, map API key, or delivery-address dialog.

## Theme responsibilities

The theme preserves the normal Dawn checkout contract in:

- `sections/ayira-main-cart-items.liquid`
- `sections/main-cart-footer.liquid`
- `snippets/cart-drawer.liquid`
- `snippets/cart-notification.liquid`
- `snippets/buy-buttons.liquid`

Ayira owns their presentation. Dawn and Shopify own submission and checkout behavior. There is no theme setting that disables Shopify checkout, and there is no pre-checkout WhatsApp order button.

## Post-order WhatsApp extension

The dynamic confirmation button is implemented in the separate `ayira-order-confirmation` Shopify app. Its first release uses the Checkout UI extension target:

- `purchase.thank-you.block.render`

An Order Status version can later use the separate Customer Account UI extension target `customer-account.order-status.block.render`. It requires a different target module and data contract.

The Thank-you extension opens a `wa.me` link only after a customer click. It includes the Shopify order number, purchased items, quantities, total, variant-aware storefront product links, and a reconstructed cart permalink:

```text
/cart/123:2,456:1?storefront=true
```

The cart permalink creates a new cart containing those variants for quick seller inspection. It is not the customer's original cart or an exact order snapshot. Shopify recalculates availability and prices; discounts, selling plans, bundles, and separate line-item properties might not be reproduced. The completed Shopify order remains the source of truth.

The message intentionally omits the customer's full address and phone number. Sending protected customer data to WhatsApp would require an explicit privacy decision and the appropriate Shopify access.

Deploy the app independently, install it on the store, add its block to the Thank-you page in the checkout and accounts editor, configure the merchant WhatsApp number in international format, save, and publish. Opening WhatsApp does not send the message or update Shopify; the customer must press **Send**.

## Verification

- Cart page, drawer, and cart notification all expose native Shopify checkout.
- Product dynamic checkout is governed by its Dawn section setting rather than a theme-wide recovery switch.
- Shopify checkout accepts an eligible local address and rejects an address without an available delivery option.
- COD is the only available payment method.
- A completed checkout creates an unpaid Shopify order.
- The Thank-you WhatsApp action opens the correct merchant conversation with the expected order summary.
- Every ordinary product line includes a variant-aware storefront link.
- The reconstructed cart link creates a fresh cart with the expected variant quantities.
- A failed product-link lookup displays a retry state instead of sending an incomplete message.
- Not sending the WhatsApp message does not remove or invalidate the Shopify order.
