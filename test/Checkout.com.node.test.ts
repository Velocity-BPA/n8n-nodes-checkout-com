/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Checkoutcom } from '../nodes/Checkout.com/Checkout.com.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Checkoutcom Node', () => {
  let node: Checkoutcom;

  beforeAll(() => {
    node = new Checkoutcom();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Checkout.com');
      expect(node.description.name).toBe('checkoutcom');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 10 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(10);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(10);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Payment Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'sk_test_key',
        baseUrl: 'https://api.checkout.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn()
      }
    };
  });

  describe('createPayment', () => {
    it('should create a payment successfully', async () => {
      const mockResponse = {
        id: 'pay_123',
        status: 'Authorized',
        amount: 1000,
        currency: 'USD'
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createPayment')
        .mockReturnValueOnce({ type: 'card', number: '4242424242424242' })
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce('USD')
        .mockReturnValueOnce('ref_123')
        .mockReturnValueOnce('')
        .mockReturnValueOnce({});

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePaymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.checkout.com/payments',
        headers: {
          'Authorization': 'sk_test_key',
          'Content-Type': 'application/json'
        },
        json: true,
        body: {
          source: { type: 'card', number: '4242424242424242' },
          amount: 1000,
          currency: 'USD',
          reference: 'ref_123'
        }
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });

    it('should handle createPayment errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createPayment')
        .mockReturnValueOnce({ type: 'card', number: '4242424242424242' })
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce('USD')
        .mockReturnValueOnce('ref_123')
        .mockReturnValueOnce('')
        .mockReturnValueOnce({});

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executePaymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'API Error' },
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('getPayment', () => {
    it('should get payment details successfully', async () => {
      const mockResponse = {
        id: 'pay_123',
        status: 'Captured',
        amount: 1000
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPayment')
        .mockReturnValueOnce('pay_123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePaymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.checkout.com/payments/pay_123',
        headers: {
          'Authorization': 'sk_test_key',
          'Content-Type': 'application/json'
        },
        json: true
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('capturePayment', () => {
    it('should capture payment successfully', async () => {
      const mockResponse = {
        id: 'act_123',
        type: 'Capture',
        amount: 1000
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('capturePayment')
        .mockReturnValueOnce('pay_123')
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce('ref_capture')
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePaymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.checkout.com/payments/pay_123/captures',
        headers: {
          'Authorization': 'sk_test_key',
          'Content-Type': 'application/json'
        },
        json: true,
        body: {
          amount: 1000,
          reference: 'ref_capture'
        }
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('refundPayment', () => {
    it('should refund payment successfully', async () => {
      const mockResponse = {
        id: 'act_456',
        type: 'Refund',
        amount: 500
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('refundPayment')
        .mockReturnValueOnce('pay_123')
        .mockReturnValueOnce(500)
        .mockReturnValueOnce('ref_refund')
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePaymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('voidPayment', () => {
    it('should void payment successfully', async () => {
      const mockResponse = {
        id: 'act_789',
        type: 'Void'
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('voidPayment')
        .mockReturnValueOnce('pay_123')
        .mockReturnValueOnce('ref_void')
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePaymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('getPaymentActions', () => {
    it('should get payment actions successfully', async () => {
      const mockResponse = [
        { id: 'act_123', type: 'Authorization' },
        { id: 'act_456', type: 'Capture' }
      ];

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPaymentActions')
        .mockReturnValueOnce('pay_123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePaymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });
});

describe('Token Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key',
        baseUrl: 'https://api.checkout.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('createToken', () => {
    it('should create a card token successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createToken')
        .mockReturnValueOnce('card')
        .mockReturnValueOnce({})
        .mockReturnValueOnce('')
        .mockReturnValueOnce('4111111111111111')
        .mockReturnValueOnce(12)
        .mockReturnValueOnce(2025)
        .mockReturnValueOnce('John Doe')
        .mockReturnValueOnce('123');

      const mockResponse = { token: 'tok_test123', type: 'card' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.checkout.com/tokens',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        body: {
          type: 'card',
          card: {
            number: '4111111111111111',
            expiry_month: 12,
            expiry_year: 2025,
            name: 'John Doe',
            cvv: '123'
          }
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle errors when creating token', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createToken')
        .mockReturnValueOnce('card')
        .mockReturnValueOnce({})
        .mockReturnValueOnce('')
        .mockReturnValueOnce('4111111111111111')
        .mockReturnValueOnce(12)
        .mockReturnValueOnce(2025)
        .mockReturnValueOnce('John Doe')
        .mockReturnValueOnce('123');

      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getToken', () => {
    it('should get token details successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getToken')
        .mockReturnValueOnce('tok_test123');

      const mockResponse = { token: 'tok_test123', type: 'card', last4: '1111' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.checkout.com/tokens/tok_test123',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle errors when getting token', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getToken')
        .mockReturnValueOnce('invalid_token');

      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Token not found'));

      const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Token not found' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Source Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.checkout.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  describe('createSource', () => {
    it('should create a source successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createSource')
        .mockReturnValueOnce('card')
        .mockReturnValueOnce('test-reference')
        .mockReturnValueOnce({ address_line1: '123 Test St', city: 'Test City' })
        .mockReturnValueOnce({})
        .mockReturnValueOnce('test-idempotency-key');

      const mockResponse = { id: 'src_test123', type: 'card', status: 'verified' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSourceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.checkout.com/sources',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
          'Cko-Idempotency-Key': 'test-idempotency-key'
        },
        body: {
          type: 'card',
          reference: 'test-reference',
          billing_address: { address_line1: '123 Test St', city: 'Test City' }
        },
        json: true,
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });

    it('should handle createSource errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createSource')
        .mockReturnValueOnce('card')
        .mockReturnValueOnce('')
        .mockReturnValueOnce({})
        .mockReturnValueOnce({})
        .mockReturnValueOnce('');

      const error = new Error('Invalid source type');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeSourceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'Invalid source type' },
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('getSource', () => {
    it('should get a source successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getSource')
        .mockReturnValueOnce('src_test123');

      const mockResponse = { id: 'src_test123', type: 'card', status: 'verified' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSourceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.checkout.com/sources/src_test123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });

    it('should handle getSource errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getSource')
        .mockReturnValueOnce('src_invalid');

      const error = new Error('Source not found');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeSourceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'Source not found' },
        pairedItem: { item: 0 },
      }]);
    });
  });
});

describe('Customer Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        secretKey: 'test-secret-key',
        baseUrl: 'https://api.checkout.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  describe('createCustomer', () => {
    it('should create a customer successfully', async () => {
      const mockResponse = { id: 'cus_123', email: 'test@example.com' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createCustomer')
        .mockReturnValueOnce('test@example.com')
        .mockReturnValueOnce('John Doe')
        .mockReturnValueOnce('+1234567890')
        .mockReturnValueOnce('');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });

    it('should handle create customer error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createCustomer')
        .mockReturnValueOnce('invalid-email');
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid email'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'Invalid email' },
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('getCustomer', () => {
    it('should get a customer successfully', async () => {
      const mockResponse = { id: 'cus_123', email: 'test@example.com' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCustomer')
        .mockReturnValueOnce('cus_123');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });

    it('should handle get customer not found error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCustomer')
        .mockReturnValueOnce('nonexistent');
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Customer not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'Customer not found' },
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('updateCustomer', () => {
    it('should update a customer successfully', async () => {
      const mockResponse = { id: 'cus_123', email: 'updated@example.com' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateCustomer')
        .mockReturnValueOnce('cus_123')
        .mockReturnValueOnce('updated@example.com')
        .mockReturnValueOnce('Jane Doe')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('deleteCustomer', () => {
    it('should delete a customer successfully', async () => {
      const mockResponse = { message: 'Customer deleted successfully' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteCustomer')
        .mockReturnValueOnce('cus_123');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });
  });
});

describe('Instrument Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.checkout.com'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('createInstrument', () => {
		it('should create an instrument successfully', async () => {
			const mockResponse = { id: 'inst_123', customer_id: 'cust_123', type: 'card' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createInstrument')
				.mockReturnValueOnce('cust_123')
				.mockReturnValueOnce('card')
				.mockReturnValueOnce({ type: 'individual', first_name: 'John', last_name: 'Doe' })
				.mockReturnValueOnce('');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeInstrumentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.checkout.com/instruments',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				body: {
					customer_id: 'cust_123',
					type: 'card',
					account_holder: { type: 'individual', first_name: 'John', last_name: 'Doe' },
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle errors when creating an instrument', async () => {
			const error = new Error('API Error');
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createInstrument')
				.mockReturnValueOnce('cust_123')
				.mockReturnValueOnce('card')
				.mockReturnValueOnce({})
				.mockReturnValueOnce('');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeInstrumentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getInstrument', () => {
		it('should get an instrument successfully', async () => {
			const mockResponse = { id: 'inst_123', customer_id: 'cust_123', type: 'card' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getInstrument')
				.mockReturnValueOnce('inst_123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeInstrumentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.checkout.com/instruments/inst_123',
				headers: {
					'Authorization': 'Bearer test-api-key',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle errors when getting an instrument', async () => {
			const error = new Error('Not Found');
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getInstrument')
				.mockReturnValueOnce('inst_123');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeInstrumentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Not Found' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('updateInstrument', () => {
		it('should update an instrument successfully', async () => {
			const mockResponse = { id: 'inst_123', updated: true };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateInstrument')
				.mockReturnValueOnce('inst_123')
				.mockReturnValueOnce({ type: 'individual', first_name: 'Jane', last_name: 'Doe' })
				.mockReturnValueOnce('');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeInstrumentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PATCH',
				url: 'https://api.checkout.com/instruments/inst_123',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				body: {
					account_holder: { type: 'individual', first_name: 'Jane', last_name: 'Doe' },
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('deleteInstrument', () => {
		it('should delete an instrument successfully', async () => {
			const mockResponse = { id: 'inst_123', deleted: true };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteInstrument')
				.mockReturnValueOnce('inst_123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeInstrumentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://api.checkout.com/instruments/inst_123',
				headers: {
					'Authorization': 'Bearer test-api-key',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Payout Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.checkout.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  test('createPayout operation success', async () => {
    const mockResponse = { 
      id: 'trf_123',
      status: 'pending',
      amount: 1000,
      currency: 'USD'
    };
    
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createPayout')
      .mockReturnValueOnce({ entity_id: 'ent_123' })
      .mockReturnValueOnce({ account_number: '12345678' })
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce('USD')
      .mockReturnValueOnce('idem_123')
      .mockReturnValueOnce('Test transfer');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executePayoutOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.checkout.com/transfers',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
        'Cko-Idempotency-Key': 'idem_123',
      },
      body: {
        source: { entity_id: 'ent_123' },
        destination: { account_number: '12345678' },
        amount: 1000,
        currency: 'USD',
        reference: 'Test transfer',
      },
      json: true,
    });
    
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('getPayout operation success', async () => {
    const mockResponse = { 
      id: 'trf_123',
      status: 'completed',
      amount: 1000,
      currency: 'USD'
    };
    
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getPayout')
      .mockReturnValueOnce('trf_123');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executePayoutOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.checkout.com/transfers/trf_123',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
    
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('handles API error with continueOnFail false', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createPayout');
    
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);

    await expect(executePayoutOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects.toThrow('API Error');
  });

  test('handles API error with continueOnFail true', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createPayout');
    
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executePayoutOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });
});

describe('Dispute Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				secretKey: 'test-secret-key',
				baseUrl: 'https://api.checkout.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	test('getAllDisputes operation should fetch disputes successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAllDisputes')
			.mockReturnValueOnce(50)
			.mockReturnValueOnce(0)
			.mockReturnValueOnce('')
			.mockReturnValueOnce('');

		const mockResponse = {
			_links: {},
			data: [
				{
					id: 'disp_test_123',
					category: 'fraudulent',
					status: 'evidence_required',
					amount: 1000,
					currency: 'USD',
				},
			],
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeDisputeOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.checkout.com/disputes?limit=50&skip=0',
			headers: {
				Authorization: 'Bearer test-secret-key',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	test('getDispute operation should fetch dispute details successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getDispute')
			.mockReturnValueOnce('disp_test_123');

		const mockResponse = {
			id: 'disp_test_123',
			category: 'fraudulent',
			status: 'evidence_required',
			amount: 1000,
			currency: 'USD',
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeDisputeOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.checkout.com/disputes/disp_test_123',
			headers: {
				Authorization: 'Bearer test-secret-key',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	test('acceptDispute operation should accept dispute successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('acceptDispute')
			.mockReturnValueOnce('disp_test_123');

		const mockResponse = {
			id: 'disp_test_123',
			status: 'accepted',
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeDisputeOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'PUT',
			url: 'https://api.checkout.com/disputes/disp_test_123/accept',
			headers: {
				Authorization: 'Bearer test-secret-key',
				'Content-Type': 'application/json',
			},
			json: true,
			body: {},
		});
	});

	test('submitDisputeEvidence operation should submit evidence successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('submitDisputeEvidence')
			.mockReturnValueOnce('disp_test_123')
			.mockReturnValueOnce('proof_of_delivery_or_service')
			.mockReturnValueOnce('base64encodedfile')
			.mockReturnValueOnce('Customer received the product');

		const mockResponse = {
			id: 'disp_test_123',
			evidence_id: 'evd_test_456',
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeDisputeOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.checkout.com/disputes/disp_test_123/evidence',
			headers: {
				Authorization: 'Bearer test-secret-key',
				'Content-Type': 'application/json',
			},
			body: {
				evidence_type: 'proof_of_delivery_or_service',
				evidence_file: 'base64encodedfile',
				evidence_text: 'Customer received the product',
			},
			json: true,
		});
	});

	test('should handle API errors gracefully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getDispute');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
			new Error('API Error'),
		);
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeDisputeOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});
});

describe('Webhook Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.checkout.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('createWebhook', () => {
		it('should create a webhook successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createWebhook')
				.mockReturnValueOnce('https://example.com/webhook')
				.mockReturnValueOnce(['payment_approved'])
				.mockReturnValueOnce('json')
				.mockReturnValueOnce({})
				.mockReturnValueOnce(true);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'wh_test123',
				url: 'https://example.com/webhook',
				event_types: ['payment_approved'],
				active: true,
			});

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: {
						id: 'wh_test123',
						url: 'https://example.com/webhook',
						event_types: ['payment_approved'],
						active: true,
					},
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle create webhook errors', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createWebhook');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: { error: 'API Error' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getAllWebhooks', () => {
		it('should get all webhooks successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllWebhooks');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue([
				{
					id: 'wh_test123',
					url: 'https://example.com/webhook',
					event_types: ['payment_approved'],
					active: true,
				},
			]);

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: [
						{
							id: 'wh_test123',
							url: 'https://example.com/webhook',
							event_types: ['payment_approved'],
							active: true,
						},
					],
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getWebhook', () => {
		it('should get webhook successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getWebhook')
				.mockReturnValueOnce('wh_test123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'wh_test123',
				url: 'https://example.com/webhook',
				event_types: ['payment_approved'],
				active: true,
			});

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: {
						id: 'wh_test123',
						url: 'https://example.com/webhook',
						event_types: ['payment_approved'],
						active: true,
					},
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('updateWebhook', () => {
		it('should update webhook successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateWebhook')
				.mockReturnValueOnce('wh_test123')
				.mockReturnValueOnce('https://example.com/webhook-updated')
				.mockReturnValueOnce(['payment_approved', 'payment_declined'])
				.mockReturnValueOnce({})
				.mockReturnValueOnce(true);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'wh_test123',
				url: 'https://example.com/webhook-updated',
				event_types: ['payment_approved', 'payment_declined'],
				active: true,
			});

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: {
						id: 'wh_test123',
						url: 'https://example.com/webhook-updated',
						event_types: ['payment_approved', 'payment_declined'],
						active: true,
					},
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('deleteWebhook', () => {
		it('should delete webhook successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteWebhook')
				.mockReturnValueOnce('wh_test123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true });

			const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: { success: true },
					pairedItem: { item: 0 },
				},
			]);
		});
	});
});

describe('Event Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.checkout.com'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	test('getAllEvents should retrieve events list', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAllEvents')
			.mockReturnValueOnce('pay_123')
			.mockReturnValueOnce('2023-01-01')
			.mockReturnValueOnce('2023-12-31')
			.mockReturnValueOnce(100);

		const mockResponse = { data: [{ id: 'evt_123', type: 'payment_approved' }] };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

		const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.checkout.com/events',
			headers: {
				'Authorization': 'test-key',
				'Content-Type': 'application/json',
			},
			qs: {
				payment_id: 'pay_123',
				from: '2023-01-01',
				to: '2023-12-31',
				limit: 100,
			},
			json: true,
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	test('getEvent should retrieve specific event', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getEvent')
			.mockReturnValueOnce('evt_123');

		const mockResponse = { id: 'evt_123', type: 'payment_approved' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

		const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.checkout.com/events/evt_123',
			headers: {
				'Authorization': 'test-key',
				'Content-Type': 'application/json',
			},
			json: true,
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	test('getEventNotifications should retrieve event notifications', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getEventNotifications')
			.mockReturnValueOnce('evt_123');

		const mockResponse = { notifications: [{ id: 'ntf_123', status: 'success' }] };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

		const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.checkout.com/events/evt_123/notifications',
			headers: {
				'Authorization': 'test-key',
				'Content-Type': 'application/json',
			},
			json: true,
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	test('retryEventNotification should retry failed notification', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('retryEventNotification')
			.mockReturnValueOnce('evt_123')
			.mockReturnValueOnce('ntf_456');

		const mockResponse = { success: true, message: 'Notification retry initiated' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

		const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.checkout.com/events/evt_123/notifications/ntf_456/retry',
			headers: {
				'Authorization': 'test-key',
				'Content-Type': 'application/json',
			},
			json: true,
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	test('should handle API errors gracefully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getEvent').mockReturnValueOnce('evt_123');
		mockExecuteFunctions.continueOnFail.mockReturnValueOnce(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(new Error('API Error'));

		const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
	});
});

describe('Session Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.checkout.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('create3dsSession', () => {
		it('should create a 3D Secure session successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('create3dsSession')
				.mockReturnValueOnce({ type: 'card', token: 'tok_123' })
				.mockReturnValueOnce(1000)
				.mockReturnValueOnce('USD')
				.mockReturnValueOnce('https://example.com/success')
				.mockReturnValueOnce('https://example.com/failure')
				.mockReturnValueOnce('');

			const mockResponse = {
				id: 'sid_123456789',
				status: 'pending',
				redirect_url: 'https://3ds.checkout.com/redirect',
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSessionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.checkout.com/3ds',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					source: { type: 'card', token: 'tok_123' },
					amount: 1000,
					currency: 'USD',
					success_url: 'https://example.com/success',
					failure_url: 'https://example.com/failure',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle errors when creating 3D Secure session', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('create3dsSession')
				.mockReturnValueOnce({ type: 'card', token: 'tok_123' })
				.mockReturnValueOnce(1000)
				.mockReturnValueOnce('USD')
				.mockReturnValueOnce('https://example.com/success')
				.mockReturnValueOnce('https://example.com/failure')
				.mockReturnValueOnce('');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeSessionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: { error: 'API Error' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('get3dsSession', () => {
		it('should retrieve 3D Secure session successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('get3dsSession')
				.mockReturnValueOnce('sid_123456789');

			const mockResponse = {
				id: 'sid_123456789',
				status: 'completed',
				authentication: {
					status: 'Y',
				},
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSessionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.checkout.com/3ds/sid_123456789',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle errors when retrieving 3D Secure session', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('get3dsSession')
				.mockReturnValueOnce('sid_123456789');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Session not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeSessionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: { error: 'Session not found' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});
});
});
