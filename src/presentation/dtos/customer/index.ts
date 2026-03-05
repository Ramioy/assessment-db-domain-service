export {
  createCustomerSchema as createCustomerRequestSchema,
  updateCustomerSchema as updateCustomerRequestSchema,
  customerSchema as customerResponseSchema,
} from '@domain/models/customer.entity';

export type {
  CreateCustomerDto as CreateCustomerRequestDto,
  UpdateCustomerDto as UpdateCustomerRequestDto,
  CustomerDto as CustomerResponseDto,
} from '@domain/models/customer.entity';
