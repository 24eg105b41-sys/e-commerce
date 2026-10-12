package com.shopsphere.service;

import com.shopsphere.dto.AdminDashboardStatsDto;
import com.shopsphere.dto.OrderDto;
import com.shopsphere.dto.ProductDto;
import com.shopsphere.enums.OrderStatus;
import com.shopsphere.enums.Role;
import com.shopsphere.repository.OrderRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service aggregating administrative dashboard statistics and reports from database tables.
 */
@Service
public class AdminService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public AdminService(ProductRepository productRepository,
                        OrderRepository orderRepository,
                        UserRepository userRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public AdminDashboardStatsDto getDashboardStats() {
        AdminDashboardStatsDto stats = new AdminDashboardStatsDto();

        stats.setTotalProducts(productRepository.countByActiveTrue());
        stats.setTotalCustomers(userRepository.countByRole(Role.ROLE_CUSTOMER));
        stats.setTotalOrders(orderRepository.count());

        long placed = orderRepository.countByOrderStatus(OrderStatus.PLACED);
        long confirmed = orderRepository.countByOrderStatus(OrderStatus.CONFIRMED);
        long shipped = orderRepository.countByOrderStatus(OrderStatus.SHIPPED);
        long delivered = orderRepository.countByOrderStatus(OrderStatus.DELIVERED);

        stats.setPendingOrders(placed + confirmed + shipped);
        stats.setCompletedOrders(delivered);

        int lowStockThreshold = 10;
        stats.setLowStockCount(productRepository.countByStockQuantityLessThanEqualAndActiveTrue(lowStockThreshold));

        BigDecimal revenue = orderRepository.calculateTotalRevenue();
        stats.setTotalRevenue(revenue != null ? revenue : BigDecimal.ZERO);

        // Recent Orders
        stats.setRecentOrders(orderRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(OrderDto::fromEntity)
                .collect(Collectors.toList()));

        // Low stock products
        stats.setLowStockProducts(productRepository.findTop5ByActiveTrueAndStockQuantityLessThanEqualOrderByStockQuantityAsc(lowStockThreshold).stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList()));

        // Order status breakdown map
        Map<String, Long> statusMap = new LinkedHashMap<>();
        for (OrderStatus s : OrderStatus.values()) {
            statusMap.put(s.name(), orderRepository.countByOrderStatus(s));
        }
        stats.setOrderStatusDistribution(statusMap);

        // Top selling products
        List<Object[]> topSelling = orderRepository.findTopSellingProducts(PageRequest.of(0, 5));
        List<Map<String, Object>> topSellingList = new ArrayList<>();
        for (Object[] row : topSelling) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", row[0]);
            map.put("quantitySold", row[1]);
            map.put("revenue", row[2]);
            topSellingList.add(map);
        }
        stats.setTopSellingProducts(topSellingList);

        return stats;
    }
}
