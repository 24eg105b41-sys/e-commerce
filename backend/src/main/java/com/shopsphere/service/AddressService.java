package com.shopsphere.service;

import com.shopsphere.dto.AddressCreateRequest;
import com.shopsphere.dto.AddressDto;
import com.shopsphere.entity.Address;
import com.shopsphere.entity.User;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.AddressRepository;
import com.shopsphere.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<AddressDto> getUserAddresses(String userEmail) {
        User user = getUserByEmail(userEmail);
        return addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(user.getId()).stream()
                .map(AddressDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressDto createAddress(String userEmail, AddressCreateRequest request) {
        User user = getUserByEmail(userEmail);

        if (request.isDefault()) {
            // Unset previous defaults
            List<Address> existing = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(user.getId());
            for (Address a : existing) {
                if (a.isDefault()) {
                    a.setDefault(false);
                    addressRepository.save(a);
                }
            }
        }

        Address address = new Address(
                user,
                request.getRecipientName().trim(),
                request.getPhone().trim(),
                request.getAddressLine().trim(),
                request.getCity().trim(),
                request.getState().trim(),
                request.getPostalCode().trim(),
                request.isDefault()
        );

        return AddressDto.fromEntity(addressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(String userEmail, Long addressId) {
        User user = getUserByEmail(userEmail);
        Address address = addressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found or does not belong to user"));
        addressRepository.delete(address);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
