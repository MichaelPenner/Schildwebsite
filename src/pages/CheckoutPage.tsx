import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { orderService } from '../services/OrderService';
import { formatPrice } from '../utils/formatting';
import { isValidEmail, isValidZip } from '../utils/validation';
import { CreditCard, Truck, CheckCircle2 } from 'lucide-react';
import type { Customer } from '../types';
import './CheckoutPage.css';

type Step = 'address' | 'shipping' | 'payment' | 'review';

const STEPS: { id: Step; label: string }[] = [
  { id: 'address', label: 'Adresse' },
  { id: 'shipping', label: 'Versand' },
  { id: 'payment', label: 'Zahlung' },
  { id: 'review', label: 'Prüfen' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, getShipping, getTotal, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState<Step>('address');
  const [customer, setCustomer] = useState<Customer>({
    id: '',
    email: '',
    billingAddress: {
      firstName: '',
      lastName: '',
      street: '',
      houseNumber: '',
      zip: '',
      city: '',
      country: 'DE',
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0) {
    navigate('/warenkorb', { replace: true });
    return null;
  }

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);

  const validateAddress = (): boolean => {
    const newErrors: Record<string, string> = {};
    const a = customer.billingAddress;
    if (!a.firstName.trim()) newErrors.firstName = 'Vorname erforderlich';
    if (!a.lastName.trim()) newErrors.lastName = 'Nachname erforderlich';
    if (!isValidEmail(customer.email)) newErrors.email = 'Gültige E-Mail erforderlich';
    if (!a.street.trim()) newErrors.street = 'Straße erforderlich';
    if (!a.houseNumber.trim()) newErrors.houseNumber = 'Hausnummer erforderlich';
    if (!isValidZip(a.zip)) newErrors.zip = 'Gültige PLZ erforderlich (5 Ziffern)';
    if (!a.city.trim()) newErrors.city = 'Stadt erforderlich';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 'address' && !validateAddress()) return;
    const idx = STEPS.findIndex((s) => s.id === currentStep);
    if (idx < STEPS.length - 1) setCurrentStep(STEPS[idx + 1].id);
  };

  const handleBack = () => {
    const idx = STEPS.findIndex((s) => s.id === currentStep);
    if (idx > 0) setCurrentStep(STEPS[idx - 1].id);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate processing
    await new Promise((r) => setTimeout(r, 1500));

    const order = orderService.createOrder(
      customer,
      items.map((item) => ({
        config: item.configuration,
        quantity: item.quantity,
      }))
    );
    orderService.updatePaymentStatus(order.id, 'paid');

    clearCart();
    navigate(`/bestellung/${order.id}`);
  };

  const updateAddress = (field: string, value: string) => {
    setCustomer((prev) => ({
      ...prev,
      billingAddress: { ...prev.billingAddress, [field]: value },
    }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="checkout-page section">
      <div className="container">
        <h1 className="heading-2">Kasse</h1>

        {/* Step indicator */}
        <div className="checkout-steps">
          {STEPS.map((step, i) => (
            <div
              key={step.id}
              className={`checkout-step ${i <= stepIndex ? 'checkout-step--active' : ''} ${
                i < stepIndex ? 'checkout-step--done' : ''
              }`}
            >
              <div className="checkout-step__dot">
                {i < stepIndex ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              <span className="checkout-step__label">{step.label}</span>
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-content glass-card-static">
            {/* Address Step */}
            {currentStep === 'address' && (
              <div className="checkout-form animate-fade-in">
                <h3 className="heading-3">Deine Daten</h3>
                <div className="checkout-form__grid">
                  <div className="checkout-form__field">
                    <label>E-Mail *</label>
                    <input
                      type="email"
                      className="glass-input"
                      value={customer.email}
                      onChange={(e) => {
                        setCustomer((p) => ({ ...p, email: e.target.value }));
                        if (errors.email) setErrors((p) => ({ ...p, email: '' }));
                      }}
                      placeholder="max@example.com"
                    />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>
                  <div className="checkout-form__field">
                    <label>Vorname *</label>
                    <input
                      type="text"
                      className="glass-input"
                      value={customer.billingAddress.firstName}
                      onChange={(e) => updateAddress('firstName', e.target.value)}
                    />
                    {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                  </div>
                  <div className="checkout-form__field">
                    <label>Nachname *</label>
                    <input
                      type="text"
                      className="glass-input"
                      value={customer.billingAddress.lastName}
                      onChange={(e) => updateAddress('lastName', e.target.value)}
                    />
                    {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                  </div>
                  <div className="checkout-form__field checkout-form__field--street">
                    <label>Straße *</label>
                    <input
                      type="text"
                      className="glass-input"
                      value={customer.billingAddress.street}
                      onChange={(e) => updateAddress('street', e.target.value)}
                    />
                    {errors.street && <span className="field-error">{errors.street}</span>}
                  </div>
                  <div className="checkout-form__field checkout-form__field--nr">
                    <label>Nr. *</label>
                    <input
                      type="text"
                      className="glass-input"
                      value={customer.billingAddress.houseNumber}
                      onChange={(e) => updateAddress('houseNumber', e.target.value)}
                    />
                    {errors.houseNumber && <span className="field-error">{errors.houseNumber}</span>}
                  </div>
                  <div className="checkout-form__field checkout-form__field--zip">
                    <label>PLZ *</label>
                    <input
                      type="text"
                      className="glass-input"
                      value={customer.billingAddress.zip}
                      onChange={(e) => updateAddress('zip', e.target.value)}
                      maxLength={5}
                    />
                    {errors.zip && <span className="field-error">{errors.zip}</span>}
                  </div>
                  <div className="checkout-form__field checkout-form__field--city">
                    <label>Stadt *</label>
                    <input
                      type="text"
                      className="glass-input"
                      value={customer.billingAddress.city}
                      onChange={(e) => updateAddress('city', e.target.value)}
                    />
                    {errors.city && <span className="field-error">{errors.city}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Step */}
            {currentStep === 'shipping' && (
              <div className="checkout-form animate-fade-in">
                <h3 className="heading-3">Versand</h3>
                <div className="checkout-shipping-options">
                  <label className="checkout-option checkout-option--active">
                    <input type="radio" name="shipping" defaultChecked />
                    <Truck size={20} />
                    <div>
                      <strong>Standardversand</strong>
                      <p className="text-secondary">3–5 Werktage</p>
                    </div>
                    <span className="checkout-option__price">{formatPrice(490)}</span>
                  </label>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <div className="checkout-form animate-fade-in">
                <h3 className="heading-3">Zahlung</h3>
                <div className="checkout-payment-notice glass-card-static">
                  <CreditCard size={24} />
                  <div>
                    <p><strong>Demo-Modus</strong></p>
                    <p className="text-secondary">
                      Die Zahlungsintegration (Stripe/PayPal) wird in Phase 2 implementiert.
                      Klicke auf „Weiter", um die Bestellung zu simulieren.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Review Step */}
            {currentStep === 'review' && (
              <div className="checkout-form animate-fade-in">
                <h3 className="heading-3">Bestellübersicht</h3>
                <div className="checkout-review">
                  <div className="checkout-review__section">
                    <h4>Lieferadresse</h4>
                    <p>
                      {customer.billingAddress.firstName} {customer.billingAddress.lastName}<br />
                      {customer.billingAddress.street} {customer.billingAddress.houseNumber}<br />
                      {customer.billingAddress.zip} {customer.billingAddress.city}
                    </p>
                    <p className="text-secondary">{customer.email}</p>
                  </div>
                  <div className="checkout-review__section">
                    <h4>Artikel ({items.length})</h4>
                    {items.map((item) => (
                      <div key={item.id} className="checkout-review__item">
                        <span>{item.configuration.textLayers[0]?.text}</span>
                        <span>×{item.quantity}</span>
                        <span className="text-accent">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="checkout-nav">
              {stepIndex > 0 && (
                <button className="btn btn-secondary" onClick={handleBack}>
                  Zurück
                </button>
              )}
              <div className="checkout-nav__spacer" />
              {currentStep !== 'review' ? (
                <button className="btn btn-primary btn-lg" onClick={handleNext}>
                  Weiter
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Wird verarbeitet…' : `Jetzt bestellen · ${formatPrice(getTotal())}`}
                </button>
              )}
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="checkout-sidebar glass-card-static">
            <h4>Deine Bestellung</h4>
            <div className="checkout-sidebar__items">
              {items.map((item) => (
                <div key={item.id} className="checkout-sidebar__item">
                  <span className="checkout-sidebar__item-name">
                    {item.configuration.textLayers[0]?.text}
                  </span>
                  <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="checkout-sidebar__totals">
              <div className="checkout-sidebar__line">
                <span className="text-secondary">Zwischensumme</span>
                <span>{formatPrice(getSubtotal())}</span>
              </div>
              <div className="checkout-sidebar__line">
                <span className="text-secondary">Versand</span>
                <span>{formatPrice(getShipping())}</span>
              </div>
              <div className="checkout-sidebar__line checkout-sidebar__line--total">
                <span>Gesamt</span>
                <span className="text-accent">{formatPrice(getTotal())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
