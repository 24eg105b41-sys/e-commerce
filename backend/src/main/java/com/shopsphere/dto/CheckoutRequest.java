package com.shopsphere.dto;

import com.shopsphere.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;

public class CheckoutRequest {

    @NotNull(message = "Delivery address is required")
    private Long addressId;

    private PaymentMethod paymentMethod = PaymentMethod.CAMPUS_PAY_SIMULATED;

    private String notes;

    public CheckoutRequest() {
    }

    public CheckoutRequest(Long addressId, PaymentMethod paymentMethod) {
        this.addressId = addressId;
        this.paymentMethod = paymentMethod;
    }

    public CheckoutRequest(Long addressId, PaymentMethod paymentMethod, String notes) {
        this.addressId = addressId;
        this.paymentMethod = paymentMethod;
        this.notes = notes;
    }

    public Long getAddressId() {
        return addressId;
    }

    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
