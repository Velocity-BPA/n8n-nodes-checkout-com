/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-checkoutcom/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class Checkoutcom implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Checkout.com',
    name: 'checkoutcom',
    icon: 'file:checkoutcom.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Checkout.com API',
    defaults: {
      name: 'Checkout.com',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'checkoutcomApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Payment',
            value: 'payment',
          },
          {
            name: 'Token',
            value: 'token',
          },
          {
            name: 'Source',
            value: 'source',
          },
          {
            name: 'Customer',
            value: 'customer',
          },
          {
            name: 'Instrument',
            value: 'instrument',
          },
          {
            name: 'Payout',
            value: 'payout',
          },
          {
            name: 'Dispute',
            value: 'dispute',
          },
          {
            name: 'Webhook',
            value: 'webhook',
          },
          {
            name: 'Event',
            value: 'event',
          },
          {
            name: 'Session',
            value: 'session',
          }
        ],
        default: 'payment',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['payment'] } },
  options: [
    { name: 'Create Payment', value: 'createPayment', description: 'Process a new payment', action: 'Create payment' },
    { name: 'Get Payment', value: 'getPayment', description: 'Retrieve payment details', action: 'Get payment' },
    { name: 'Capture Payment', value: 'capturePayment', description: 'Capture an authorized payment', action: 'Capture payment' },
    { name: 'Refund Payment', value: 'refundPayment', description: 'Refund a payment', action: 'Refund payment' },
    { name: 'Void Payment', value: 'voidPayment', description: 'Void an authorized payment', action: 'Void payment' },
    { name: 'Get Payment Actions', value: 'getPaymentActions', description: 'Get payment action history', action: 'Get payment actions' }
  ],
  default: 'createPayment',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['token'] } },
  options: [
    { name: 'Create Token', value: 'createToken', description: 'Create a payment token', action: 'Create a payment token' },
    { name: 'Get Token', value: 'getToken', description: 'Retrieve token details', action: 'Get token details' }
  ],
  default: 'createToken',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['source'] } },
  options: [
    { name: 'Create Source', value: 'createSource', description: 'Add a new payment source', action: 'Create a payment source' },
    { name: 'Get Source', value: 'getSource', description: 'Retrieve source details', action: 'Get a payment source' }
  ],
  default: 'createSource',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['customer'] } },
  options: [
    { name: 'Create Customer', value: 'createCustomer', description: 'Create a new customer', action: 'Create a customer' },
    { name: 'Get Customer', value: 'getCustomer', description: 'Retrieve customer details', action: 'Get a customer' },
    { name: 'Update Customer', value: 'updateCustomer', description: 'Update customer information', action: 'Update a customer' },
    { name: 'Delete Customer', value: 'deleteCustomer', description: 'Delete a customer', action: 'Delete a customer' },
  ],
  default: 'createCustomer',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['instrument'],
		},
	},
	options: [
		{
			name: 'Create Instrument',
			value: 'createInstrument',
			description: 'Store a payment instrument',
			action: 'Create an instrument',
		},
		{
			name: 'Get Instrument',
			value: 'getInstrument',
			description: 'Retrieve instrument details',
			action: 'Get an instrument',
		},
		{
			name: 'Update Instrument',
			value: 'updateInstrument',
			description: 'Update instrument information',
			action: 'Update an instrument',
		},
		{
			name: 'Delete Instrument',
			value: 'deleteInstrument',
			description: 'Delete a stored instrument',
			action: 'Delete an instrument',
		},
	],
	default: 'createInstrument',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['payout'] } },
  options: [
    { name: 'Create Payout', value: 'createPayout', description: 'Initiate a payout transfer', action: 'Create a payout' },
    { name: 'Get Payout', value: 'getPayout', description: 'Retrieve payout details', action: 'Get a payout' },
  ],
  default: 'createPayout',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['dispute'] } },
	options: [
		{
			name: 'Get All Disputes',
			value: 'getAllDisputes',
			description: 'List all disputes',
			action: 'Get all disputes',
		},
		{
			name: 'Get Dispute',
			value: 'getDispute',
			description: 'Retrieve dispute details',
			action: 'Get a dispute',
		},
		{
			name: 'Accept Dispute',
			value: 'acceptDispute',
			description: 'Accept a dispute',
			action: 'Accept a dispute',
		},
		{
			name: 'Submit Dispute Evidence',
			value: 'submitDisputeEvidence',
			description: 'Submit evidence for dispute',
			action: 'Submit dispute evidence',
		},
	],
	default: 'getAllDisputes',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
		},
	},
	options: [
		{
			name: 'Create Webhook',
			value: 'createWebhook',
			description: 'Register a webhook endpoint',
			action: 'Create a webhook',
		},
		{
			name: 'Get All Webhooks',
			value: 'getAllWebhooks',
			description: 'List all webhook configurations',
			action: 'Get all webhooks',
		},
		{
			name: 'Get Webhook',
			value: 'getWebhook',
			description: 'Retrieve webhook details',
			action: 'Get a webhook',
		},
		{
			name: 'Update Webhook',
			value: 'updateWebhook',
			description: 'Update webhook configuration',
			action: 'Update a webhook',
		},
		{
			name: 'Delete Webhook',
			value: 'deleteWebhook',
			description: 'Delete a webhook',
			action: 'Delete a webhook',
		},
	],
	default: 'createWebhook',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['event'],
		},
	},
	options: [
		{
			name: 'Get All Events',
			value: 'getAllEvents',
			description: 'List events with filtering',
			action: 'Get all events',
		},
		{
			name: 'Get Event',
			value: 'getEvent',
			description: 'Retrieve specific event details',
			action: 'Get an event',
		},
		{
			name: 'Get Event Notifications',
			value: 'getEventNotifications',
			description: 'Get notifications for an event',
			action: 'Get event notifications',
		},
		{
			name: 'Retry Event Notification',
			value: 'retryEventNotification',
			description: 'Retry failed notification',
			action: 'Retry event notification',
		},
	],
	default: 'getAllEvents',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['session'],
		},
	},
	options: [
		{
			name: 'Create 3D Secure Session',
			value: 'create3dsSession',
			description: 'Create a new 3D Secure authentication session',
			action: 'Create 3D Secure session',
		},
		{
			name: 'Get 3D Secure Session',
			value: 'get3dsSession',
			description: 'Retrieve 3D Secure session details',
			action: 'Get 3D Secure session',
		},
	],
	default: 'create3dsSession',
},
{
  displayName: 'Payment ID',
  name: 'paymentId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['payment'],
      operation: ['getPayment', 'capturePayment', 'refundPayment', 'voidPayment', 'getPaymentActions']
    }
  },
  default: '',
  description: 'The payment ID'
},
{
  displayName: 'Source',
  name: 'source',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['payment'],
      operation: ['createPayment']
    }
  },
  default: '{}',
  description: 'Payment source (card details, token, etc.)'
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['payment'],
      operation: ['createPayment', 'capturePayment', 'refundPayment']
    }
  },
  default: 0,
  description: 'Payment amount in minor currency units (e.g., cents for USD)'
},
{
  displayName: 'Currency',
  name: 'currency',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['payment'],
      operation: ['createPayment']
    }
  },
  default: 'USD',
  description: 'ISO 4217 currency code'
},
{
  displayName: 'Reference',
  name: 'reference',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['payment'],
      operation: ['createPayment', 'capturePayment', 'refundPayment', 'voidPayment']
    }
  },
  default: '',
  description: 'Payment reference'
},
{
  displayName: 'Idempotency Key',
  name: 'idempotencyKey',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['payment'],
      operation: ['createPayment', 'capturePayment', 'refundPayment', 'voidPayment']
    }
  },
  default: '',
  description: 'Idempotency key to prevent duplicate requests'
},
{
  displayName: 'Additional Fields',
  name: 'additionalFields',
  type: 'collection',
  placeholder: 'Add Field',
  displayOptions: {
    show: {
      resource: ['payment'],
      operation: ['createPayment']
    }
  },
  default: {},
  options: [
    {
      displayName: 'Capture',
      name: 'capture',
      type: 'boolean',
      default: true,
      description: 'Whether to capture the payment immediately'
    },
    {
      displayName: 'Customer',
      name: 'customer',
      type: 'json',
      default: '{}',
      description: 'Customer details'
    },
    {
      displayName: 'Description',
      name: 'description',
      type: 'string',
      default: '',
      description: 'Payment description'
    },
    {
      displayName: 'Metadata',
      name: 'metadata',
      type: 'json',
      default: '{}',
      description: 'Payment metadata'
    }
  ]
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['token'], operation: ['createToken'] } },
  options: [
    { name: 'Card', value: 'card' },
    { name: 'Apple Pay', value: 'applepay' },
    { name: 'Google Pay', value: 'googlepay' }
  ],
  default: 'card',
  description: 'The type of payment instrument to tokenize',
},
{
  displayName: 'Card Number',
  name: 'cardNumber',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['token'], operation: ['createToken'], type: ['card'] } },
  default: '',
  description: 'The card number (PAN)',
},
{
  displayName: 'Expiry Month',
  name: 'expiryMonth',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['token'], operation: ['createToken'], type: ['card'] } },
  default: 1,
  description: 'The card expiry month (1-12)',
},
{
  displayName: 'Expiry Year',
  name: 'expiryYear',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['token'], operation: ['createToken'], type: ['card'] } },
  default: 2025,
  description: 'The card expiry year',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  displayOptions: { show: { resource: ['token'], operation: ['createToken'], type: ['card'] } },
  default: '',
  description: 'The cardholder name',
},
{
  displayName: 'CVV',
  name: 'cvv',
  type: 'string',
  displayOptions: { show: { resource: ['token'], operation: ['createToken'], type: ['card'] } },
  default: '',
  description: 'The card verification value',
},
{
  displayName: 'Billing Address',
  name: 'billingAddress',
  type: 'collection',
  placeholder: 'Add Billing Address Field',
  displayOptions: { show: { resource: ['token'], operation: ['createToken'] } },
  default: {},
  options: [
    {
      displayName: 'Address Line 1',
      name: 'address_line1',
      type: 'string',
      default: '',
    },
    {
      displayName: 'Address Line 2',
      name: 'address_line2',
      type: 'string',
      default: '',
    },
    {
      displayName: 'City',
      name: 'city',
      type: 'string',
      default: '',
    },
    {
      displayName: 'State',
      name: 'state',
      type: 'string',
      default: '',
    },
    {
      displayName: 'Zip',
      name: 'zip',
      type: 'string',
      default: '',
    },
    {
      displayName: 'Country',
      name: 'country',
      type: 'string',
      default: '',
    }
  ],
},
{
  displayName: 'Token Data',
  name: 'tokenData',
  type: 'json',
  displayOptions: { show: { resource: ['token'], operation: ['createToken'], type: ['applepay', 'googlepay'] } },
  default: '{}',
  description: 'The payment token data for Apple Pay or Google Pay',
},
{
  displayName: 'Idempotency Key',
  name: 'idempotencyKey',
  type: 'string',
  displayOptions: { show: { resource: ['token'], operation: ['createToken'] } },
  default: '',
  description: 'Optional idempotency key for safe retries',
},
{
  displayName: 'Token',
  name: 'token',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['token'], operation: ['getToken'] } },
  default: '',
  description: 'The token to retrieve',
},
{
  displayName: 'Source ID',
  name: 'sourceId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['source'], operation: ['getSource'] } },
  default: '',
  description: 'The unique identifier of the source to retrieve',
},
{
  displayName: 'Source Type',
  name: 'type',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['source'], operation: ['createSource'] } },
  options: [
    { name: 'Card', value: 'card' },
    { name: 'Digital Wallet', value: 'digital_wallet' },
    { name: 'Bank Transfer', value: 'bank_transfer' },
    { name: 'Alternative Payment', value: 'alternative_payment' }
  ],
  default: 'card',
  description: 'The type of payment source to create',
},
{
  displayName: 'Reference',
  name: 'reference',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['source'], operation: ['createSource'] } },
  default: '',
  description: 'A reference identifier for the source',
},
{
  displayName: 'Billing Address',
  name: 'billingAddress',
  type: 'collection',
  placeholder: 'Add Billing Address Field',
  displayOptions: { show: { resource: ['source'], operation: ['createSource'] } },
  default: {},
  options: [
    {
      displayName: 'Address Line 1',
      name: 'address_line1',
      type: 'string',
      default: '',
    },
    {
      displayName: 'Address Line 2',
      name: 'address_line2',
      type: 'string',
      default: '',
    },
    {
      displayName: 'City',
      name: 'city',
      type: 'string',
      default: '',
    },
    {
      displayName: 'State',
      name: 'state',
      type: 'string',
      default: '',
    },
    {
      displayName: 'ZIP Code',
      name: 'zip',
      type: 'string',
      default: '',
    },
    {
      displayName: 'Country',
      name: 'country',
      type: 'string',
      default: '',
      description: 'ISO 3166-1 alpha-2 country code',
    }
  ],
},
{
  displayName: 'Additional Fields',
  name: 'additionalFields',
  type: 'collection',
  placeholder: 'Add Field',
  displayOptions: { show: { resource: ['source'], operation: ['createSource'] } },
  default: {},
  options: [
    {
      displayName: 'Customer',
      name: 'customer',
      type: 'string',
      default: '',
      description: 'Customer ID to associate with the source',
    },
    {
      displayName: 'Metadata',
      name: 'metadata',
      type: 'fixedCollection',
      typeOptions: {
        multipleValues: true,
      },
      default: {},
      options: [
        {
          name: 'metadataFields',
          displayName: 'Metadata Field',
          values: [
            {
              displayName: 'Key',
              name: 'key',
              type: 'string',
              default: '',
            },
            {
              displayName: 'Value',
              name: 'value',
              type: 'string',
              default: '',
            },
          ],
        },
      ],
    }
  ],
},
{
  displayName: 'Idempotency Key',
  name: 'idempotencyKey',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['source'], operation: ['createSource'] } },
  default: '',
  description: 'Optional idempotency key to ensure request uniqueness',
},
{
  displayName: 'Customer Email',
  name: 'email',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['customer'],
      operation: ['createCustomer'],
    },
  },
  default: '',
  placeholder: 'customer@example.com',
  description: 'Email address of the customer',
},
{
  displayName: 'Customer Name',
  name: 'name',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['customer'],
      operation: ['createCustomer'],
    },
  },
  default: '',
  description: 'Full name of the customer',
},
{
  displayName: 'Phone Number',
  name: 'phone',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['customer'],
      operation: ['createCustomer'],
    },
  },
  default: '',
  description: 'Phone number of the customer',
},
{
  displayName: 'Customer ID',
  name: 'customerId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['customer'],
      operation: ['getCustomer', 'updateCustomer', 'deleteCustomer'],
    },
  },
  default: '',
  description: 'The ID of the customer',
},
{
  displayName: 'Customer Email',
  name: 'email',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['customer'],
      operation: ['updateCustomer'],
    },
  },
  default: '',
  placeholder: 'customer@example.com',
  description: 'Updated email address of the customer',
},
{
  displayName: 'Customer Name',
  name: 'name',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['customer'],
      operation: ['updateCustomer'],
    },
  },
  default: '',
  description: 'Updated full name of the customer',
},
{
  displayName: 'Phone Number',
  name: 'phone',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['customer'],
      operation: ['updateCustomer'],
    },
  },
  default: '',
  description: 'Updated phone number of the customer',
},
{
  displayName: 'Idempotency Key',
  name: 'idempotencyKey',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['customer'],
      operation: ['createCustomer', 'updateCustomer'],
    },
  },
  default: '',
  description: 'Unique key to ensure idempotent requests',
},
{
	displayName: 'Customer ID',
	name: 'customer_id',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['instrument'],
			operation: ['createInstrument'],
		},
	},
	default: '',
	description: 'The unique identifier of the customer',
},
{
	displayName: 'Type',
	name: 'type',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['instrument'],
			operation: ['createInstrument'],
		},
	},
	options: [
		{
			name: 'Card',
			value: 'card',
		},
		{
			name: 'Bank Account',
			value: 'bank_account',
		},
	],
	default: 'card',
	description: 'The type of payment instrument',
},
{
	displayName: 'Account Holder',
	name: 'account_holder',
	type: 'collection',
	placeholder: 'Add Account Holder',
	displayOptions: {
		show: {
			resource: ['instrument'],
			operation: ['createInstrument', 'updateInstrument'],
		},
	},
	default: {},
	options: [
		{
			displayName: 'Type',
			name: 'type',
			type: 'options',
			options: [
				{
					name: 'Individual',
					value: 'individual',
				},
				{
					name: 'Corporate',
					value: 'corporate',
				},
			],
			default: 'individual',
		},
		{
			displayName: 'First Name',
			name: 'first_name',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Last Name',
			name: 'last_name',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Email',
			name: 'email',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Phone',
			name: 'phone',
			type: 'string',
			default: '',
		},
	],
},
{
	displayName: 'Instrument ID',
	name: 'id',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['instrument'],
			operation: ['getInstrument', 'updateInstrument', 'deleteInstrument'],
		},
	},
	default: '',
	description: 'The unique identifier of the instrument',
},
{
	displayName: 'Idempotency Key',
	name: 'idempotencyKey',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['instrument'],
			operation: ['createInstrument', 'updateInstrument'],
		},
	},
	default: '',
	description: 'A unique key to ensure idempotent requests',
},
{
  displayName: 'Source',
  name: 'source',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['payout'], operation: ['createPayout'] } },
  default: '{}',
  description: 'Source of funds for the payout (e.g., entity ID, account details)',
},
{
  displayName: 'Destination',
  name: 'destination',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['payout'], operation: ['createPayout'] } },
  default: '{}',
  description: 'Destination for the payout (bank account or card details)',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['payout'], operation: ['createPayout'] } },
  default: 0,
  description: 'Amount to transfer in minor currency units (e.g., cents for USD)',
},
{
  displayName: 'Currency',
  name: 'currency',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['payout'], operation: ['createPayout'] } },
  default: 'USD',
  description: 'Currency code in ISO 4217 format',
},
{
  displayName: 'Idempotency Key',
  name: 'idempotencyKey',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['payout'], operation: ['createPayout'] } },
  default: '',
  description: 'Unique key to prevent duplicate transfers',
},
{
  displayName: 'Reference',
  name: 'reference',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['payout'], operation: ['createPayout'] } },
  default: '',
  description: 'Reference for the payout',
},
{
  displayName: 'Payout ID',
  name: 'payoutId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['payout'], operation: ['getPayout'] } },
  default: '',
  description: 'ID of the payout to retrieve',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	default: 50,
	description: 'The maximum number of disputes to return',
	displayOptions: {
		show: {
			resource: ['dispute'],
			operation: ['getAllDisputes'],
		},
	},
},
{
	displayName: 'Skip',
	name: 'skip',
	type: 'number',
	default: 0,
	description: 'The number of disputes to skip',
	displayOptions: {
		show: {
			resource: ['dispute'],
			operation: ['getAllDisputes'],
		},
	},
},
{
	displayName: 'From Date',
	name: 'from',
	type: 'dateTime',
	default: '',
	description: 'The start date for filtering disputes',
	displayOptions: {
		show: {
			resource: ['dispute'],
			operation: ['getAllDisputes'],
		},
	},
},
{
	displayName: 'To Date',
	name: 'to',
	type: 'dateTime',
	default: '',
	description: 'The end date for filtering disputes',
	displayOptions: {
		show: {
			resource: ['dispute'],
			operation: ['getAllDisputes'],
		},
	},
},
{
	displayName: 'Dispute ID',
	name: 'id',
	type: 'string',
	required: true,
	default: '',
	description: 'The unique identifier for the dispute',
	displayOptions: {
		show: {
			resource: ['dispute'],
			operation: ['getDispute', 'acceptDispute', 'submitDisputeEvidence'],
		},
	},
},
{
	displayName: 'Evidence Type',
	name: 'evidenceType',
	type: 'options',
	required: true,
	default: 'proof_of_delivery_or_service',
	options: [
		{
			name: 'Proof of Delivery or Service',
			value: 'proof_of_delivery_or_service',
		},
		{
			name: 'Proof of Refund or Cancellation',
			value: 'proof_of_refund_or_cancellation',
		},
		{
			name: 'Customer Communication',
			value: 'customer_communication',
		},
		{
			name: 'Receipt',
			value: 'receipt',
		},
		{
			name: 'Invoice',
			value: 'invoice',
		},
		{
			name: 'Customer Signature',
			value: 'customer_signature',
		},
		{
			name: 'Proof of Authorization',
			value: 'proof_of_authorization',
		},
		{
			name: 'ARN',
			value: 'arn',
		},
		{
			name: 'Other',
			value: 'other',
		},
	],
	description: 'The type of evidence being submitted',
	displayOptions: {
		show: {
			resource: ['dispute'],
			operation: ['submitDisputeEvidence'],
		},
	},
},
{
	displayName: 'Evidence File',
	name: 'evidenceFile',
	type: 'string',
	default: '',
	description: 'Base64 encoded evidence file',
	displayOptions: {
		show: {
			resource: ['dispute'],
			operation: ['submitDisputeEvidence'],
		},
	},
},
{
	displayName: 'Evidence Text',
	name: 'evidenceText',
	type: 'string',
	typeOptions: {
		rows: 4,
	},
	default: '',
	description: 'Textual evidence or description',
	displayOptions: {
		show: {
			resource: ['dispute'],
			operation: ['submitDisputeEvidence'],
		},
	},
},
{
	displayName: 'Webhook URL',
	name: 'url',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['createWebhook', 'updateWebhook'],
		},
	},
	default: '',
	description: 'The URL endpoint for the webhook',
},
{
	displayName: 'Event Types',
	name: 'eventTypes',
	type: 'multiOptions',
	required: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['createWebhook', 'updateWebhook'],
		},
	},
	options: [
		{ name: 'Payment Approved', value: 'payment_approved' },
		{ name: 'Payment Declined', value: 'payment_declined' },
		{ name: 'Payment Captured', value: 'payment_captured' },
		{ name: 'Payment Voided', value: 'payment_voided' },
		{ name: 'Payment Refunded', value: 'payment_refunded' },
		{ name: 'Payment Pending', value: 'payment_pending' },
		{ name: 'Payment Expired', value: 'payment_expired' },
		{ name: 'Payment Canceled', value: 'payment_canceled' },
		{ name: 'Dispute Created', value: 'dispute_created' },
		{ name: 'Dispute Won', value: 'dispute_won' },
		{ name: 'Dispute Lost', value: 'dispute_lost' },
	],
	default: ['payment_approved'],
	description: 'Types of events to subscribe to',
},
{
	displayName: 'Content Type',
	name: 'contentType',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['createWebhook'],
		},
	},
	options: [
		{ name: 'JSON', value: 'json' },
		{ name: 'XML', value: 'xml' },
	],
	default: 'json',
	description: 'Format of the webhook payload',
},
{
	displayName: 'Webhook ID',
	name: 'webhookId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['getWebhook', 'updateWebhook', 'deleteWebhook'],
		},
	},
	default: '',
	description: 'The ID of the webhook',
},
{
	displayName: 'Headers',
	name: 'headers',
	type: 'fixedCollection',
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['createWebhook', 'updateWebhook'],
		},
	},
	default: {},
	typeOptions: {
		multipleValues: true,
	},
	description: 'Custom headers to include with the webhook',
	options: [
		{
			name: 'header',
			displayName: 'Header',
			values: [
				{
					displayName: 'Name',
					name: 'name',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Value',
					name: 'value',
					type: 'string',
					default: '',
				},
			],
		},
	],
},
{
	displayName: 'Active',
	name: 'active',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['webhook'],
			operation: ['createWebhook', 'updateWebhook'],
		},
	},
	default: true,
	description: 'Whether the webhook is active',
},
{
	displayName: 'Payment ID',
	name: 'paymentId',
	type: 'string',
	default: '',
	description: 'Filter events by payment ID',
	displayOptions: {
		show: {
			resource: ['event'],
			operation: ['getAllEvents'],
		},
	},
},
{
	displayName: 'From Date',
	name: 'from',
	type: 'dateTime',
	default: '',
	description: 'Filter events from this date',
	displayOptions: {
		show: {
			resource: ['event'],
			operation: ['getAllEvents'],
		},
	},
},
{
	displayName: 'To Date',
	name: 'to',
	type: 'dateTime',
	default: '',
	description: 'Filter events up to this date',
	displayOptions: {
		show: {
			resource: ['event'],
			operation: ['getAllEvents'],
		},
	},
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	default: 50,
	description: 'Maximum number of events to return',
	typeOptions: {
		minValue: 1,
		maxValue: 1000,
	},
	displayOptions: {
		show: {
			resource: ['event'],
			operation: ['getAllEvents'],
		},
	},
},
{
	displayName: 'Event ID',
	name: 'eventId',
	type: 'string',
	required: true,
	default: '',
	description: 'The ID of the event to retrieve',
	displayOptions: {
		show: {
			resource: ['event'],
			operation: ['getEvent', 'getEventNotifications', 'retryEventNotification'],
		},
	},
},
{
	displayName: 'Notification ID',
	name: 'notificationId',
	type: 'string',
	required: true,
	default: '',
	description: 'The ID of the notification to retry',
	displayOptions: {
		show: {
			resource: ['event'],
			operation: ['retryEventNotification'],
		},
	},
},
{
	displayName: 'Source',
	name: 'source',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['session'],
			operation: ['create3dsSession'],
		},
	},
	default: '{}',
	description: 'Payment source information for 3D Secure authentication',
	placeholder: '{"type": "card", "token": "tok_123"}',
},
{
	displayName: 'Amount',
	name: 'amount',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['session'],
			operation: ['create3dsSession'],
		},
	},
	default: 0,
	description: 'Payment amount in minor currency units (e.g., cents for USD)',
	placeholder: '1000',
},
{
	displayName: 'Currency',
	name: 'currency',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['session'],
			operation: ['create3dsSession'],
		},
	},
	default: 'USD',
	description: 'ISO 4217 currency code',
	placeholder: 'USD',
},
{
	displayName: 'Success URL',
	name: 'successUrl',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['session'],
			operation: ['create3dsSession'],
		},
	},
	default: '',
	description: 'URL to redirect to on successful authentication',
	placeholder: 'https://example.com/success',
},
{
	displayName: 'Failure URL',
	name: 'failureUrl',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['session'],
			operation: ['create3dsSession'],
		},
	},
	default: '',
	description: 'URL to redirect to on failed authentication',
	placeholder: 'https://example.com/failure',
},
{
	displayName: 'Idempotency Key',
	name: 'idempotencyKey',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['session'],
			operation: ['create3dsSession'],
		},
	},
	default: '',
	description: 'Idempotency key to ensure request uniqueness',
},
{
	displayName: 'Session ID',
	name: 'sessionId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['session'],
			operation: ['get3dsSession'],
		},
	},
	default: '',
	description: 'The ID of the 3D Secure session to retrieve',
	placeholder: 'sid_123456789',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'payment':
        return [await executePaymentOperations.call(this, items)];
      case 'token':
        return [await executeTokenOperations.call(this, items)];
      case 'source':
        return [await executeSourceOperations.call(this, items)];
      case 'customer':
        return [await executeCustomerOperations.call(this, items)];
      case 'instrument':
        return [await executeInstrumentOperations.call(this, items)];
      case 'payout':
        return [await executePayoutOperations.call(this, items)];
      case 'dispute':
        return [await executeDisputeOperations.call(this, items)];
      case 'webhook':
        return [await executeWebhookOperations.call(this, items)];
      case 'event':
        return [await executeEventOperations.call(this, items)];
      case 'session':
        return [await executeSessionOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executePaymentOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('checkoutcomApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      const baseOptions: any = {
        headers: {
          'Authorization': credentials.apiKey,
          'Content-Type': 'application/json'
        },
        json: true
      };

      switch (operation) {
        case 'createPayment': {
          const source = this.getNodeParameter('source', i) as any;
          const amount = this.getNodeParameter('amount', i) as number;
          const currency = this.getNodeParameter('currency', i) as string;
          const reference = this.getNodeParameter('reference', i) as string;
          const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;
          const additionalFields = this.getNodeParameter('additionalFields', i) as any;

          const body: any = {
            source,
            amount,
            currency,
            reference
          };

          if (additionalFields.capture !== undefined) {
            body.capture = additionalFields.capture;
          }
          if (additionalFields.customer) {
            body.customer = additionalFields.customer;
          }
          if (additionalFields.description) {
            body.description = additionalFields.description;
          }
          if (additionalFields.metadata) {
            body.metadata = additionalFields.metadata;
          }

          const options: any = {
            ...baseOptions,
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.checkout.com'}/payments`,
            body
          };

          if (idempotencyKey) {
            options.headers['Cko-Idempotency-Key'] = idempotencyKey;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPayment': {
          const paymentId = this.getNodeParameter('paymentId', i) as string;

          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.checkout.com'}/payments/${paymentId}`
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'capturePayment': {
          const paymentId = this.getNodeParameter('paymentId', i) as string;
          const amount = this.getNodeParameter('amount', i) as number;
          const reference = this.getNodeParameter('reference', i) as string;
          const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;

          const body: any = {
            amount,
            reference
          };

          const options: any = {
            ...baseOptions,
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.checkout.com'}/payments/${paymentId}/captures`,
            body
          };

          if (idempotencyKey) {
            options.headers['Cko-Idempotency-Key'] = idempotencyKey;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'refundPayment': {
          const paymentId = this.getNodeParameter('paymentId', i) as string;
          const amount = this.getNodeParameter('amount', i) as number;
          const reference = this.getNodeParameter('reference', i) as string;
          const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;

          const body: any = {
            amount,
            reference
          };

          const options: any = {
            ...baseOptions,
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.checkout.com'}/payments/${paymentId}/refunds`,
            body
          };

          if (idempotencyKey) {
            options.headers['Cko-Idempotency-Key'] = idempotencyKey;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'voidPayment': {
          const paymentId = this.getNodeParameter('paymentId', i) as string;
          const reference = this.getNodeParameter('reference', i) as string;
          const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;

          const body: any = {
            reference
          };

          const options: any = {
            ...baseOptions,
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.checkout.com'}/payments/${paymentId}/voids`,
            body
          };

          if (idempotencyKey) {
            options.headers['Cko-Idempotency-Key'] = idempotencyKey;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPaymentActions': {
          const paymentId = this.getNodeParameter('paymentId', i) as string;

          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.checkout.com'}/payments/${paymentId}/actions`
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeTokenOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('checkoutcomApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createToken': {
          const type = this.getNodeParameter('type', i) as string;
          const billingAddress = this.getNodeParameter('billingAddress', i) as any;
          const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;

          let body: any = {
            type: type,
          };

          if (type === 'card') {
            const cardNumber = this.getNodeParameter('cardNumber', i) as string;
            const expiryMonth = this.getNodeParameter('expiryMonth', i) as number;
            const expiryYear = this.getNodeParameter('expiryYear', i) as number;
            const name = this.getNodeParameter('name', i) as string;
            const cvv = this.getNodeParameter('cvv', i) as string;

            body.card = {
              number: cardNumber,
              expiry_month: expiryMonth,
              expiry_year: expiryYear,
            };

            if (name) {
              body.card.name = name;
            }

            if (cvv) {
              body.card.cvv = cvv;
            }
          } else {
            const tokenData = this.getNodeParameter('tokenData', i) as string;
            body.token_data = JSON.parse(tokenData);
          }

          if (Object.keys(billingAddress).length > 0) {
            body.billing_address = billingAddress;
          }

          const headers: any = {
            'Authorization': `Bearer ${credentials.apiKey}`,
            'Content-Type': 'application/json',
          };

          if (idempotencyKey) {
            headers['Cko-Idempotency-Key'] = idempotencyKey;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.checkout.com'}/tokens`,
            headers: headers,
            body: body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getToken': {
          const token = this.getNodeParameter('token', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.checkout.com'}/tokens/${token}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeSourceOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('checkoutcomApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createSource': {
          const type = this.getNodeParameter('type', i) as string;
          const reference = this.getNodeParameter('reference', i) as string;
          const billingAddress = this.getNodeParameter('billingAddress', i) as any;
          const additionalFields = this.getNodeParameter('additionalFields', i) as any;
          const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;

          const body: any = {
            type,
          };

          if (reference) {
            body.reference = reference;
          }

          if (Object.keys(billingAddress).length > 0) {
            body.billing_address = billingAddress;
          }

          if (additionalFields.customer) {
            body.customer = additionalFields.customer;
          }

          if (additionalFields.metadata && additionalFields.metadata.metadataFields) {
            const metadata: any = {};
            for (const field of additionalFields.metadata.metadataFields) {
              metadata[field.key] = field.value;
            }
            body.metadata = metadata;
          }

          const headers: any = {
            'Authorization': `Bearer ${credentials.apiKey}`,
            'Content-Type': 'application/json',
          };

          if (idempotencyKey) {
            headers['Cko-Idempotency-Key'] = idempotencyKey;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.checkout.com'}/sources`,
            headers,
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSource': {
          const sourceId = this.getNodeParameter('sourceId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.checkout.com'}/sources/${sourceId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeCustomerOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('checkoutcomApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createCustomer': {
          const email = this.getNodeParameter('email', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const phone = this.getNodeParameter('phone', i) as string;
          const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;

          const body: any = {
            email,
          };

          if (name) body.name = name;
          if (phone) body.phone = phone;

          const headers: any = {
            'Authorization': `Bearer ${credentials.secretKey}`,
            'Content-Type': 'application/json',
          };

          if (idempotencyKey) {
            headers['Cko-Idempotency-Key'] = idempotencyKey;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.checkout.com'}/customers`,
            headers,
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCustomer': {
          const customerId = this.getNodeParameter('customerId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.checkout.com'}/customers/${customerId}`,
            headers: {
              'Authorization': `Bearer ${credentials.secretKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateCustomer': {
          const customerId = this.getNodeParameter('customerId', i) as string;
          const email = this.getNodeParameter('email', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const phone = this.getNodeParameter('phone', i) as string;
          const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;

          const body: any = {};

          if (email) body.email = email;
          if (name) body.name = name;
          if (phone) body.phone = phone;

          const headers: any = {
            'Authorization': `Bearer ${credentials.secretKey}`,
            'Content-Type': 'application/json',
          };

          if (idempotencyKey) {
            headers['Cko-Idempotency-Key'] = idempotencyKey;
          }

          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl || 'https://api.checkout.com'}/customers/${customerId}`,
            headers,
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteCustomer': {
          const customerId = this.getNodeParameter('customerId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl || 'https://api.checkout.com'}/customers/${customerId}`,
            headers: {
              'Authorization': `Bearer ${credentials.secretKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeInstrumentOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('checkoutcomApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'createInstrument': {
					const customerId = this.getNodeParameter('customer_id', i) as string;
					const type = this.getNodeParameter('type', i) as string;
					const accountHolder = this.getNodeParameter('account_holder', i) as any;
					const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;

					const body: any = {
						customer_id: customerId,
						type: type,
					};

					if (accountHolder && Object.keys(accountHolder).length > 0) {
						body.account_holder = accountHolder;
					}

					const headers: any = {
						'Authorization': `Bearer ${credentials.apiKey}`,
						'Content-Type': 'application/json',
					};

					if (idempotencyKey) {
						headers['Cko-Idempotency-Key'] = idempotencyKey;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl || 'https://api.checkout.com'}/instruments`,
						headers: headers,
						body: body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getInstrument': {
					const instrumentId = this.getNodeParameter('id', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl || 'https://api.checkout.com'}/instruments/${instrumentId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateInstrument': {
					const instrumentId = this.getNodeParameter('id', i) as string;
					const accountHolder = this.getNodeParameter('account_holder', i) as any;
					const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;

					const body: any = {};

					if (accountHolder && Object.keys(accountHolder).length > 0) {
						body.account_holder = accountHolder;
					}

					const headers: any = {
						'Authorization': `Bearer ${credentials.apiKey}`,
						'Content-Type': 'application/json',
					};

					if (idempotencyKey) {
						headers['Cko-Idempotency-Key'] = idempotencyKey;
					}

					const options: any = {
						method: 'PATCH',
						url: `${credentials.baseUrl || 'https://api.checkout.com'}/instruments/${instrumentId}`,
						headers: headers,
						body: body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteInstrument': {
					const instrumentId = this.getNodeParameter('id', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl || 'https://api.checkout.com'}/instruments/${instrumentId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executePayoutOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('checkoutcomApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createPayout': {
          const source = this.getNodeParameter('source', i) as any;
          const destination = this.getNodeParameter('destination', i) as any;
          const amount = this.getNodeParameter('amount', i) as number;
          const currency = this.getNodeParameter('currency', i) as string;
          const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;
          const reference = this.getNodeParameter('reference', i) as string;

          const body: any = {
            source: typeof source === 'string' ? JSON.parse(source) : source,
            destination: typeof destination === 'string' ? JSON.parse(destination) : destination,
            amount,
            currency,
          };

          if (reference) {
            body.reference = reference;
          }

          const headers: any = {
            'Authorization': `Bearer ${credentials.apiKey}`,
            'Content-Type': 'application/json',
          };

          if (idempotencyKey) {
            headers['Cko-Idempotency-Key'] = idempotencyKey;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/transfers`,
            headers,
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPayout': {
          const payoutId = this.getNodeParameter('payoutId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/transfers/${payoutId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeDisputeOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('checkoutcomApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAllDisputes': {
					const limit = this.getNodeParameter('limit', i) as number;
					const skip = this.getNodeParameter('skip', i) as number;
					const from = this.getNodeParameter('from', i) as string;
					const to = this.getNodeParameter('to', i) as string;

					const queryParams = new URLSearchParams();
					if (limit) queryParams.append('limit', limit.toString());
					if (skip) queryParams.append('skip', skip.toString());
					if (from) queryParams.append('from', from);
					if (to) queryParams.append('to', to);

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/disputes${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
						headers: {
							'Authorization': `Bearer ${credentials.secretKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getDispute': {
					const disputeId = this.getNodeParameter('id', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/disputes/${disputeId}`,
						headers: {
							'Authorization': `Bearer ${credentials.secretKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'acceptDispute': {
					const disputeId = this.getNodeParameter('id', i) as string;

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/disputes/${disputeId}/accept`,
						headers: {
							'Authorization': `Bearer ${credentials.secretKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
						body: {},
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'submitDisputeEvidence': {
					const disputeId = this.getNodeParameter('id', i) as string;
					const evidenceType = this.getNodeParameter('evidenceType', i) as string;
					const evidenceFile = this.getNodeParameter('evidenceFile', i) as string;
					const evidenceText = this.getNodeParameter('evidenceText', i) as string;

					const evidenceData: any = {
						evidence_type: evidenceType,
					};

					if (evidenceFile) {
						evidenceData.evidence_file = evidenceFile;
					}

					if (evidenceText) {
						evidenceData.evidence_text = evidenceText;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/disputes/${disputeId}/evidence`,
						headers: {
							'Authorization': `Bearer ${credentials.secretKey}`,
							'Content-Type': 'application/json',
						},
						body: evidenceData,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i },
					);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeWebhookOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('checkoutcomApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'createWebhook': {
					const url = this.getNodeParameter('url', i) as string;
					const eventTypes = this.getNodeParameter('eventTypes', i) as string[];
					const contentType = this.getNodeParameter('contentType', i) as string;
					const headers = this.getNodeParameter('headers', i, {}) as any;
					const active = this.getNodeParameter('active', i, true) as boolean;

					const body: any = {
						url,
						event_types: eventTypes,
						content_type: contentType,
						active,
					};

					if (headers.header && headers.header.length > 0) {
						body.headers = {};
						for (const header of headers.header) {
							if (header.name && header.value) {
								body.headers[header.name] = header.value;
							}
						}
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/webhooks`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAllWebhooks': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/webhooks`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getWebhook': {
					const webhookId = this.getNodeParameter('webhookId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/webhooks/${webhookId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateWebhook': {
					const webhookId = this.getNodeParameter('webhookId', i) as string;
					const url = this.getNodeParameter('url', i) as string;
					const eventTypes = this.getNodeParameter('eventTypes', i) as string[];
					const headers = this.getNodeParameter('headers', i, {}) as any;
					const active = this.getNodeParameter('active', i, true) as boolean;

					const body: any = {
						url,
						event_types: eventTypes,
						active,
					};

					if (headers.header && headers.header.length > 0) {
						body.headers = {};
						for (const header of headers.header) {
							if (header.name && header.value) {
								body.headers[header.name] = header.value;
							}
						}
					}

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/webhooks/${webhookId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteWebhook': {
					const webhookId = this.getNodeParameter('webhookId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/webhooks/${webhookId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeEventOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('checkoutcomApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAllEvents': {
					const paymentId = this.getNodeParameter('paymentId', i) as string;
					const from = this.getNodeParameter('from', i) as string;
					const to = this.getNodeParameter('to', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;

					const qs: any = {};
					if (paymentId) qs.payment_id = paymentId;
					if (from) qs.from = from;
					if (to) qs.to = to;
					if (limit) qs.limit = limit;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/events`,
						headers: {
							'Authorization': credentials.apiKey,
							'Content-Type': 'application/json',
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getEvent': {
					const eventId = this.getNodeParameter('eventId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/events/${eventId}`,
						headers: {
							'Authorization': credentials.apiKey,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getEventNotifications': {
					const eventId = this.getNodeParameter('eventId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/events/${eventId}/notifications`,
						headers: {
							'Authorization': credentials.apiKey,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'retryEventNotification': {
					const eventId = this.getNodeParameter('eventId', i) as string;
					const notificationId = this.getNodeParameter('notificationId', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/events/${eventId}/notifications/${notificationId}/retry`,
						headers: {
							'Authorization': credentials.apiKey,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeSessionOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('checkoutcomApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'create3dsSession': {
					const source = this.getNodeParameter('source', i) as object;
					const amount = this.getNodeParameter('amount', i) as number;
					const currency = this.getNodeParameter('currency', i) as string;
					const successUrl = this.getNodeParameter('successUrl', i) as string;
					const failureUrl = this.getNodeParameter('failureUrl', i) as string;
					const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;

					const body: any = {
						source,
						amount,
						currency,
						success_url: successUrl,
						failure_url: failureUrl,
					};

					const headers: any = {
						'Authorization': `Bearer ${credentials.apiKey}`,
						'Content-Type': 'application/json',
					};

					if (idempotencyKey) {
						headers['Cko-Idempotency-Key'] = idempotencyKey;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/3ds`,
						headers,
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'get3dsSession': {
					const sessionId = this.getNodeParameter('sessionId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/3ds/${sessionId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
