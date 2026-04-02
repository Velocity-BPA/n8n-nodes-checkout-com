import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CheckoutcomApi implements ICredentialType {
	name = 'checkoutcomApi';
	displayName = 'Checkout.com API';
	documentationUrl = 'https://docs.checkout.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'Secret Key',
			name: 'secretKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Secret key from your Checkout.com dashboard (sk_sbox_ for sandbox, sk_ for live)',
			required: true,
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Sandbox',
					value: 'sandbox',
				},
				{
					name: 'Live',
					value: 'live',
				},
			],
			default: 'sandbox',
			description: 'The environment to connect to',
		},
		{
			displayName: 'API Base URL',
			name: 'apiBaseUrl',
			type: 'string',
			default: 'https://api.checkout.com',
			description: 'Base URL for Checkout.com API',
			required: true,
		},
	];
}