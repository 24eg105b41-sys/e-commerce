package com.shopsphere.config;

import com.shopsphere.entity.Category;
import com.shopsphere.entity.Product;
import com.shopsphere.entity.User;
import com.shopsphere.enums.Role;
import com.shopsphere.repository.CategoryRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * Initializes development seed data and ensures an administrator account is present.
 * Prevents duplicate insertions on repeated application startups.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-email:admin@shopsphere.edu}")
    private String adminEmail;

    @Value("${app.admin.default-password:Admin@Campus2026}")
    private String adminPassword;

    public DataInitializer(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        bootstrapUsers();
        bootstrapCatalog();
    }

    private void bootstrapUsers() {
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setFullName("Campus System Administrator");
            admin.setEmail(adminEmail);
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ROLE_ADMIN);
            admin.setPhone("9876543210");
            admin.setActive(true);
            userRepository.save(admin);
            log.info("Initialized default administrator: {}", adminEmail);
        }

        String demoStudentEmail = "student@shopsphere.edu";
        if (!userRepository.existsByEmail(demoStudentEmail)) {
            User student = new User();
            student.setFullName("Arun Kumar (CSE 3rd Year)");
            student.setEmail(demoStudentEmail);
            student.setPasswordHash(passwordEncoder.encode("Student@Campus2026"));
            student.setRole(Role.ROLE_CUSTOMER);
            student.setPhone("9876543211");
            student.setActive(true);
            userRepository.save(student);
            log.info("Initialized demo student account: {}", demoStudentEmail);
        }
    }

    private void bootstrapCatalog() {
        if (categoryRepository.count() > 0) {
            log.info("Catalog data already seeded. Skipping initial catalog bootstrap.");
            return;
        }

        log.info("Seeding realistic campus catalog for AU-R24 demonstration...");

        // Categories
        Category catLaptops = categoryRepository.save(new Category(
                "Laptops & Computers", "laptops-computers",
                "High-performance laptops, ultrabooks, and workstations for coding and engineering simulation.",
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80"
        ));

        Category catAccessories = categoryRepository.save(new Category(
                "Computer Accessories", "computer-accessories",
                "Ergonomic mechanical keyboards, precision mice, laptop stands, and USB-C multiport hubs.",
                "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80"
        ));

        Category catAudio = categoryRepository.save(new Category(
                "Headphones & Audio", "headphones-audio",
                "Noise-cancelling headphones and wireless earbuds for distraction-free library study.",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
        ));

        Category catBooks = categoryRepository.save(new Category(
                "Engineering Books", "engineering-books",
                "Prescribed textbooks for Computer Science, Data Structures, Algorithms, and AI syllabus.",
                "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80"
        ));

        Category catStationery = categoryRepository.save(new Category(
                "Stationery & Notebooks", "stationery-notebooks",
                "Engineering graph pads, grid project notebooks, drafting pens, and sticky organizers.",
                "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80"
        ));

        Category catDesk = categoryRepository.save(new Category(
                "Study & Desk Accessories", "study-desk-accessories",
                "LED study lamps, cable organizers, back-support cushions, and thermal coffee tumblers.",
                "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80"
        ));

        Category catSmart = categoryRepository.save(new Category(
                "Smart Campus Devices", "smart-campus-devices",
                "Scientific calculators, digital stylus pens, smart watches, and portable power banks.",
                "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80"
        ));

        // 22 Realistic Products with BigDecimal prices in INR
        List<Product> products = List.of(
                // Laptops
                createProduct(catLaptops, "ThinkPad E14 Gen 5 (Core i5 13th Gen, 16GB RAM, 512GB SSD)",
                        "thinkpad-e14-gen-5",
                        "The quintessential engineering laptop built for Java IDEs, Docker, and Linux dual-booting. Spill-resistant keyboard, 14-inch FHD IPS display, and military-grade durability.",
                        "Lenovo", "LP-LEN-E14", new BigDecimal("58990.00"), 18,
                        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80"),

                createProduct(catLaptops, "MacBook Air M2 (8-Core CPU, 8-Core GPU, 16GB Unified RAM, 256GB SSD)",
                        "macbook-air-m2-16gb",
                        "Incredible battery life up to 18 hours for all-day campus lectures. Silent fanless design with Liquid Retina display, ideal for web development and university tasks.",
                        "Apple", "LP-APL-M2AIR", new BigDecimal("89900.00"), 12,
                        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80"),

                createProduct(catLaptops, "ASUS Vivobook 16X (Ryzen 5 5600H, 16GB RAM, 512GB SSD, RTX 2050)",
                        "asus-vivobook-16x",
                        "Affordable engineering powerhouse equipped with dedicated NVIDIA GPU for machine learning model training, CAD, and occasional gaming.",
                        "ASUS", "LP-ASU-16X", new BigDecimal("51990.00"), 8,
                        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80"),

                // Computer Accessories
                createProduct(catAccessories, "Keychron K2 V2 Wireless Mechanical Keyboard (Brown Switches)",
                        "keychron-k2-v2",
                        "Compact 75% layout mechanical keyboard with tactile Gateron Brown switches. Bluetooth 5.1 and Type-C wired connectivity with Mac and Windows layout keycaps.",
                        "Keychron", "AC-KEY-K2V2", new BigDecimal("6999.00"), 25,
                        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"),

                createProduct(catAccessories, "Logitech MX Master 3S Ergonomic Wireless Mouse",
                        "logitech-mx-master-3s",
                        "Ultra-quiet 8K DPI sensor that tracks on any surface, including hostel dorm glass tables. MagSpeed electromagnetic scrolling up to 1,000 lines per second.",
                        "Logitech", "AC-LOG-MX3S", new BigDecimal("7995.00"), 15,
                        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80"),

                createProduct(catAccessories, "Anker 7-in-1 USB-C Multiport Hub with 100W Power Delivery",
                        "anker-7-in-1-usb-c-hub",
                        "Features 4K HDMI, 2 USB-A data ports, SD and microSD card readers, and 100W pass-through charging. Essential for ultrabooks with limited I/O.",
                        "Anker", "AC-ANK-HUB7", new BigDecimal("2999.00"), 40,
                        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"),

                createProduct(catAccessories, "Foldable Aluminum Ergonomic Laptop Stand with Heat Dissipation",
                        "ergonomic-aluminum-laptop-stand",
                        "Adjustable height and angle to maintain proper eye-level posture during lengthy coding sessions. Ventilated design prevents thermal throttling.",
                        "Portronics", "AC-POR-STAND", new BigDecimal("899.00"), 50,
                        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80"),

                // Audio
                createProduct(catAudio, "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
                        "sony-wh-1000xm4",
                        "Industry-leading noise cancellation engineered to silence crowded campus libraries and hostel rooms. 30-hour battery life with speak-to-chat convenience.",
                        "Sony", "AU-SNY-XM4", new BigDecimal("19990.00"), 14,
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"),

                createProduct(catAudio, "OnePlus Nord Buds 2 True Wireless Earbuds with Active Noise Cancellation",
                        "oneplus-nord-buds-2",
                        "Budget-friendly ANC wireless earbuds with dual microphones, titanium dynamic bass drivers, and IP55 water and dust resistance for daily commuting.",
                        "OnePlus", "AU-1PL-NB2", new BigDecimal("2299.00"), 35,
                        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80"),

                // Engineering Books
                createProduct(catBooks, "Introduction to Algorithms, 4th Edition (CLRS) by Thomas H. Cormen",
                        "clrs-introduction-to-algorithms-4th",
                        "The definitive core reference for undergraduate Data Structures and Algorithms. Comprehensive coverage of graph algorithms, dynamic programming, and complexity.",
                        "MIT Press", "BK-MIT-CLRS4", new BigDecimal("1850.00"), 45,
                        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"),

                createProduct(catBooks, "Clean Code: A Handbook of Agile Software Craftsmanship by Robert C. Martin",
                        "clean-code-robert-martin",
                        "A must-read for any student learning full-stack Java development. Teaches meaningful naming, function design, refactoring, and unit test best practices.",
                        "Pearson", "BK-PRS-CLNC", new BigDecimal("899.00"), 30,
                        "https://images.unsplash.com/photo-1532012164546-f432f2e37b73?auto=format&fit=crop&w=600&q=80"),

                createProduct(catBooks, "Operating System Concepts, 10th Edition by Silberschatz, Galvin & Gagne",
                        "silberschatz-operating-system-concepts",
                        "Known as the classic 'Dinosaur Book'. Covers processes, threads, CPU scheduling, synchronization, deadlocks, and virtual memory systems.",
                        "Wiley", "BK-WLY-OS10", new BigDecimal("995.00"), 22,
                        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80"),

                createProduct(catBooks, "Computer Networking: A Top-Down Approach, 8th Edition by Kurose & Ross",
                        "computer-networking-top-down-8th",
                        "Comprehensive network engineering text structuring the Internet protocol stack from the Application layer down to Physical link transmission.",
                        "Pearson", "BK-PRS-NET8", new BigDecimal("850.00"), 28,
                        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80"),

                // Stationery
                createProduct(catStationery, "Classmate Pulse 6-Subject Spiral Bound Engineering Notebook (300 Pages)",
                        "classmate-pulse-6-subject-notebook",
                        "Polypropylene durable cover notebook with tear-off micro-perforated ruled sheets. Perfect for taking lecture notes across an entire semester.",
                        "Classmate", "ST-CLS-PULSE", new BigDecimal("220.00"), 120,
                        "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80"),

                createProduct(catStationery, "Uni-ball Eye Fine UB-157 Roller Ball Pens (Pack of 5, Blue)",
                        "uniball-eye-ub157-pack5",
                        "Fade-proof, waterproof Super Ink rollerball pen with 0.7mm tungsten carbide ball. Glides smoothly across examination answer sheets.",
                        "Uni-ball", "ST-UNI-UB157", new BigDecimal("320.00"), 80,
                        "https://images.unsplash.com/photo-1585336261026-407421cb4450?auto=format&fit=crop&w=600&q=80"),

                createProduct(catStationery, "Camlin Kokuyo Geometry & Technical Drawing Instrument Box",
                        "camlin-geometry-box",
                        "Precision compass, divider, 180-degree protractor, set squares, and mechanical pencil for Engineering Graphics and Drawing coursework.",
                        "Camlin", "ST-CAM-GEOM", new BigDecimal("190.00"), 65,
                        "https://images.unsplash.com/photo-1584697964190-705b89368205?auto=format&fit=crop&w=600&q=80"),

                // Study & Desk Accessories
                createProduct(catDesk, "Baseus LED ScreenBar Monitor Light with Touch Brightness Dimmer",
                        "baseus-led-screenbar-light",
                        "Asymmetric optical design illuminates your keyboard and workspace without reflecting glare on your computer screen. USB powered.",
                        "Baseus", "DK-BAS-LGT1", new BigDecimal("2499.00"), 20,
                        "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80"),

                createProduct(catDesk, "Milton Insulated Stainless Steel Coffee Tumbler (500ml)",
                        "milton-thermosteel-tumbler",
                        "Double-walled vacuum insulation keeps tea and coffee piping hot for 12 hours during late-night exam study sessions. Leak-proof flip lid.",
                        "Milton", "DK-MLT-TUMB", new BigDecimal("650.00"), 45,
                        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80"),

                createProduct(catDesk, "Ergonomic Memory Foam Lumbar Support Back Cushion for Study Chairs",
                        "ergonomic-lumbar-support-cushion",
                        "Contoured high-density memory foam provides orthopedic lumbar spine relief during extended lab programming hours.",
                        "Grin Health", "DK-GRN-CUSH", new BigDecimal("1350.00"), 30,
                        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80"),

                // Smart Campus Devices
                createProduct(catSmart, "Casio FX-991CW Advanced ClassWiz Non-Programmable Scientific Calculator",
                        "casio-fx-991cw-scientific-calculator",
                        "Official Anna University approved scientific calculator for semester exams. High-resolution four-gradation display with 540 functions.",
                        "Casio", "SM-CAS-991CW", new BigDecimal("1495.00"), 90,
                        "https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?auto=format&fit=crop&w=600&q=80"),

                createProduct(catSmart, "Mi 20000mAh 18W Fast Charging Power Bank 3i (Triple Output)",
                        "mi-powerbank-3i-20000mah",
                        "High-capacity portable battery equipped with dual USB-A and USB-C inputs to charge smartphones, calculators, and wireless headphones on campus.",
                        "Xiaomi", "SM-XIA-PB20K", new BigDecimal("1899.00"), 40,
                        "https://images.unsplash.com/photo-1609592424367-93510e140d7c?auto=format&fit=crop&w=600&q=80"),

                createProduct(catSmart, "SanDisk Ultra Dual Drive Go 128GB Type-C and Type-A Flash Drive",
                        "sandisk-dual-drive-go-128gb",
                        "High-speed USB 3.1 flash drive with dual connectors to transfer project assignments easily between modern laptops, phones, and university lab PCs.",
                        "SanDisk", "SM-SND-128GB", new BigDecimal("999.00"), 75,
                        "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=600&q=80")
        );

        productRepository.saveAll(products);
        log.info("Successfully seeded {} campus catalog products across {} categories.", products.size(), 7);
    }

    private Product createProduct(Category category, String name, String slug, String description,
                                  String brand, String sku, BigDecimal price, Integer stockQuantity, String imageUrl) {
        Product product = new Product(category, name, slug, description, brand, sku, price, stockQuantity, imageUrl);
        product.setAverageRating(new BigDecimal("4.5"));
        product.setReviewCount(5);
        return product;
    }
}
