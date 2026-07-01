Frontend
    |
    | Opens Paddle Checkout
    |
Paddle Checkout
    |
    | Customer pays
    |
Paddle
    |---------------------------> Webhook (payment_completed / transaction.completed)
    |                                |
    |                                | Verify signature
    |                                | Get complete transaction
    |                                | Save to database
    |                                |
    |
    +---------------------------> Success URL
                                     |
                                     | Show "Payment Successful"
                                     | Fetch payment status from backend

Why not the success URL?

The user can:

Close the browser.
Refresh the page.
Change query parameters.
Never reach the success URL.

But Paddle always sends a webhook (assuming the endpoint is available).

So the database should be updated from the webhook, not the redirect.