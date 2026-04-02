# n8n-nodes-checkout-com

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with Checkout.com payment processing platform. This node provides access to 10 core resources including payments, tokens, sources, customers, instruments, payouts, disputes, webhooks, events, and sessions, enabling comprehensive payment workflow automation and management.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Checkout.com](https://img.shields.io/badge/Checkout.com-API-orange)
![Payments](https://img.shields.io/badge/Payments-Processing-green)
![PCI](https://img.shields.io/badge/PCI-Compliant-red)

## Features

- **Payment Processing** - Create, capture, void, and refund payments with comprehensive transaction management
- **Tokenization** - Securely tokenize payment methods for recurring transactions and PCI compliance
- **Customer Management** - Create and manage customer profiles with stored payment instruments
- **Multi-Source Payments** - Support for cards, digital wallets, bank transfers, and alternative payment methods
- **Payout Operations** - Process payouts to various destinations including bank accounts and cards
- **Dispute Handling** - Monitor and manage chargebacks and dispute resolution workflows
- **Webhook Integration** - Real-time event notifications for payment status updates and lifecycle events
- **Session Management** - Handle secure payment sessions for checkout flows and authentication

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-checkout-com`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-checkout-com
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-checkout-com.git
cd n8n-nodes-checkout-com
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-checkout-com
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Checkout.com secret API key (starts with sk_) | Yes |
| Environment | Select Sandbox or Live environment | Yes |
| Public Key | Your Checkout.com public key (starts with pk_) for certain operations | No |

## Resources & Operations

### 1. Payment

| Operation | Description |
|-----------|-------------|
| Create | Process a new payment with card, token, or alternative payment method |
| Get | Retrieve payment details and status by payment ID |
| Capture | Capture a previously authorized payment |
| Void | Cancel an authorized payment before capture |
| Refund | Issue full or partial refund for a captured payment |
| List | Retrieve multiple payments with filtering options |

### 2. Token

| Operation | Description |
|-----------|-------------|
| Create | Tokenize payment method details for secure storage |
| Get | Retrieve token information and associated payment method |
| Delete | Remove a stored token from the system |
| List | Get all tokens associated with a customer |

### 3. Source

| Operation | Description |
|-----------|-------------|
| Create | Create a new payment source (card, bank account, digital wallet) |
| Get | Retrieve source details and verification status |
| Update | Modify source information or metadata |
| Delete | Remove a payment source |
| List | Get all sources for a customer |

### 4. Customer

| Operation | Description |
|-----------|-------------|
| Create | Create a new customer profile with contact information |
| Get | Retrieve customer details and associated payment methods |
| Update | Modify customer information and metadata |
| Delete | Remove customer profile and associated data |
| List | Retrieve multiple customers with search and filtering |

### 5. Instrument

| Operation | Description |
|-----------|-------------|
| Create | Create a payment instrument linked to a customer |
| Get | Retrieve instrument details and verification status |
| Update | Modify instrument information or set as default |
| Delete | Remove payment instrument from customer |
| List | Get all instruments for a specific customer |

### 6. Payout

| Operation | Description |
|-----------|-------------|
| Create | Process payout to bank account, card, or digital wallet |
| Get | Retrieve payout details and processing status |
| List | Get multiple payouts with date and status filtering |

### 7. Dispute

| Operation | Description |
|-----------|-------------|
| Get | Retrieve dispute details and current status |
| Accept | Accept a dispute and process chargeback |
| Provide Evidence | Submit evidence to contest a dispute |
| List | Get all disputes with filtering by status and date |

### 8. Webhook

| Operation | Description |
|-----------|-------------|
| Create | Register webhook endpoint for event notifications |
| Get | Retrieve webhook configuration and status |
| Update | Modify webhook URL or event subscriptions |
| Delete | Remove webhook endpoint |
| List | Get all configured webhooks |

### 9. Event

| Operation | Description |
|-----------|-------------|
| Get | Retrieve specific event details by event ID |
| List | Get events with filtering by type, date, and status |
| Retry | Manually retry failed webhook delivery |

### 10. Session

| Operation | Description |
|-----------|-------------|
| Create | Create secure payment session for checkout flow |
| Get | Retrieve session details and current state |
| Update | Modify session configuration or metadata |

## Usage Examples

```javascript
// Create a payment with card details
{
  "source": {
    "type": "card",
    "number": "4242424242424242",
    "expiry_month": 12,
    "expiry_year": 2025,
    "cvv": "123"
  },
  "amount": 2500,
  "currency": "USD",
  "reference": "ORD-12345",
  "description": "Order payment"
}
```

```javascript
// Create a customer with payment instrument
{
  "email": "customer@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "metadata": {
    "customer_id": "CUST-001",
    "segment": "premium"
  }
}
```

```javascript
// Process a payout to bank account
{
  "amount": 10000,
  "currency": "USD",
  "destination": {
    "type": "bank_account",
    "account_number": "12345678",
    "routing_number": "021000021",
    "account_type": "checking"
  },
  "reference": "PAYOUT-789"
}
```

```javascript
// Create webhook for payment events
{
  "url": "https://myapp.com/webhooks/checkout",
  "event_types": [
    "payment_approved",
    "payment_captured",
    "payment_declined"
  ],
  "content_type": "json",
  "active": true
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key is correct and for the right environment |
| Insufficient Funds | Payment declined due to insufficient account balance | Check card balance or try alternative payment method |
| Invalid Card Details | Card number, expiry, or CVV validation failed | Verify card information and ensure proper formatting |
| Webhook Delivery Failed | Webhook endpoint unreachable or returned error | Check endpoint URL accessibility and response handling |
| Rate Limit Exceeded | Too many API requests in short time period | Implement request throttling and retry with backoff |
| Currency Not Supported | Attempted transaction in unsupported currency | Check supported currencies for your account region |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-checkout-com/issues)
- **Checkout.com API Documentation**: [docs.checkout.com](https://docs.checkout.com)
- **Developer Community**: [checkout.com/developers](https://checkout.com/developers)