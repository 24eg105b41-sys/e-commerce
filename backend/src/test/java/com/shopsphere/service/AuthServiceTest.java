package com.shopsphere.service;

import com.shopsphere.dto.AuthResponse;
import com.shopsphere.dto.LoginRequest;
import com.shopsphere.dto.RegisterRequest;
import com.shopsphere.entity.User;
import com.shopsphere.enums.Role;
import com.shopsphere.exception.ConflictException;
import com.shopsphere.repository.UserRepository;
import com.shopsphere.security.CustomUserDetails;
import com.shopsphere.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User("Arun Kumar", "arun@campus.edu", "hashed_pwd_123", Role.ROLE_CUSTOMER);
        sampleUser.setId(10L);
    }

    @Test
    @DisplayName("Should successfully register a new student with BCrypt hashing and ROLE_CUSTOMER")
    void testSuccessfulRegistration() {
        RegisterRequest request = new RegisterRequest("Arun Kumar", "arun@campus.edu", "PlainPassword123", "9876543210");

        when(userRepository.existsByEmail("arun@campus.edu")).thenReturn(false);
        when(passwordEncoder.encode("PlainPassword123")).thenReturn("hashed_pwd_123");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mock_jwt_token_xyz");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock_jwt_token_xyz", response.getToken());
        assertEquals("arun@campus.edu", response.getEmail());
        assertEquals(Role.ROLE_CUSTOMER.name(), response.getRole());
        verify(passwordEncoder).encode("PlainPassword123");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Should reject registration when email already exists")
    void testDuplicateEmailRejection() {
        RegisterRequest request = new RegisterRequest("Arun Kumar", "existing@campus.edu", "PlainPassword123", "9876543210");
        when(userRepository.existsByEmail("existing@campus.edu")).thenReturn(true);

        assertThrows(ConflictException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should authenticate valid credentials and issue JWT")
    void testSuccessfulLogin() {
        LoginRequest request = new LoginRequest("arun@campus.edu", "Password123");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mock_jwt_token_login");
        when(userRepository.findByEmail("arun@campus.edu")).thenReturn(Optional.of(sampleUser));

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock_jwt_token_login", response.getToken());
        assertEquals("arun@campus.edu", response.getEmail());
    }
}
