package com.shopsphere.enums;

/**
 * Order lifecycle status with defined state transitions.
 */
public enum OrderStatus {
    PLACED,
    CONFIRMED,
    SHIPPED,
    DELIVERED,
    CANCELLED;

    /**
     * Validates if a transition from current status to target status is permitted.
     */
    public boolean canTransitionTo(OrderStatus next) {
        if (this == next) return true;
        return switch (this) {
            case PLACED -> (next == CONFIRMED || next == CANCELLED);
            case CONFIRMED -> (next == SHIPPED || next == CANCELLED);
            case SHIPPED -> (next == DELIVERED);
            case DELIVERED, CANCELLED -> false; // Terminal states
        };
    }
}
