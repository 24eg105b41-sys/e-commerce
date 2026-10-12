package com.shopsphere.controller;

import com.shopsphere.dto.AddressCreateRequest;
import com.shopsphere.dto.AddressDto;
import com.shopsphere.dto.ApiResponse;
import com.shopsphere.service.AddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@Tag(name = "Addresses", description = "Endpoints for managing student delivery addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    @Operation(summary = "Get all delivery addresses for current user")
    public ResponseEntity<ApiResponse<List<AddressDto>>> getAddresses(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(addressService.getUserAddresses(userDetails.getUsername())));
    }

    @PostMapping
    @Operation(summary = "Add a new delivery address")
    public ResponseEntity<ApiResponse<AddressDto>> createAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AddressCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Address added successfully",
                        addressService.createAddress(userDetails.getUsername(), request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a delivery address")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        addressService.deleteAddress(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Address deleted successfully", null));
    }
}
