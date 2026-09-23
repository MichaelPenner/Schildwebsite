export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
  country: string;
  phone?: string;
}

export interface Customer {
  id: string;
  email: string;
  billingAddress: Address;
  shippingAddress?: Address;
}
