package com.shopsphere.dto;

import com.shopsphere.entity.Address;

public class AddressDto {

    private Long id;
    private String recipientName;
    private String phone;
    private String addressLine;
    private String city;
    private String state;
    private String postalCode;
    private boolean isDefault;

    public AddressDto() {
    }

    public static AddressDto fromEntity(Address a) {
        AddressDto dto = new AddressDto();
        dto.setId(a.getId());
        dto.setRecipientName(a.getRecipientName());
        dto.setPhone(a.getPhone());
        dto.setAddressLine(a.getAddressLine());
        dto.setCity(a.getCity());
        dto.setState(a.getState());
        dto.setPostalCode(a.getPostalCode());
        dto.setDefault(a.isDefault());
        return dto;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddressLine() {
        return addressLine;
    }

    public void setAddressLine(String addressLine) {
        this.addressLine = addressLine;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean aDefault) {
        isDefault = aDefault;
    }
}
