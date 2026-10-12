package com.shopsphere.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Knowledge base service for campus store policies and guidelines (RAG component).
 * Manages chunked policy documents and returns grounded citations for user inquiries.
 */
@Service
public class CampusKnowledgeBaseService {

    public record PolicyDocument(String title, String category, String section, String content, String citation) {}

    private final List<PolicyDocument> policyKnowledgeBase = new ArrayList<>();

    public CampusKnowledgeBaseService() {
        initPolicyDocuments();
    }

    private void initPolicyDocuments() {
        policyKnowledgeBase.add(new PolicyDocument(
                "Hostel & Campus Delivery Guidelines",
                "Shipping",
                "Sec 1.1 - Delivery Timelines & Charges",
                "ShopSphere Campus provides free delivery to all on-campus hostels, research blocks, and departmental buildings for orders totaling ₹499 or more. A flat nominal delivery fee of ₹40 applies for smaller orders. Standard campus dispatch completes within 24 hours of confirmation.",
                "[Campus Store Policy: Sec 1.1 - Shipping & Hostel Delivery]"
        ));

        policyKnowledgeBase.add(new PolicyDocument(
                "7-Day Student Return & Replacement Policy",
                "Returns",
                "Sec 2.3 - Return Eligibility for Books & Electronics",
                "Students can request a return or replacement within 7 calendar days of delivery. Engineering textbooks must have intact binding and no missing problem sheets. Hardware devices and electronics with manufacturing defects qualify for immediate 1-to-1 replacement upon verification at the Campus Store Desk.",
                "[Campus Store Policy: Sec 2.3 - 7-Day Returns & Exchanges]"
        ));

        policyKnowledgeBase.add(new PolicyDocument(
                "Student Laptop & Hardware Warranty Assistance",
                "Warranty",
                "Sec 3.0 - Laptop & Device Service",
                "All brand-new laptops, keyboards, and audio equipment purchased through ShopSphere Campus carry official manufacturer warranty (typically 1 to 2 years). The Campus Tech Support Desk (Library 2nd Floor, Room 204) provides free authorized diagnostic submission and loaner devices during repairs.",
                "[Campus Store Policy: Sec 3.0 - Device Warranty & Tech Desk]"
        ));

        policyKnowledgeBase.add(new PolicyDocument(
                "Engineering Textbook Buyback Program",
                "Textbooks",
                "Sec 4.2 - Semester End Textbook Resale",
                "At the conclusion of each academic semester, registered students can return prescribed engineering textbooks in good condition for up to 40% store credit towards the subsequent semester's required course materials.",
                "[Campus Store Policy: Sec 4.2 - Textbook Buyback Program]"
        ));

        policyKnowledgeBase.add(new PolicyDocument(
                "Campus Pay Simulated Wallet & UPI Demonstration",
                "Payments",
                "Sec 5.1 - Educational Payment Workflow",
                "ShopSphere Campus utilizes an educational simulated payment gateway designed for computer science capstone evaluation. Students can test checkouts using simulated UPI QR codes, instant Campus Pay mock credits, or Cash-on-Delivery with zero real monetary liability.",
                "[Campus Store Policy: Sec 5.1 - Simulated Payment Protocol]"
        ));
    }

    /**
     * Retrieves relevant policy chunks and citations matching query tokens.
     */
    public List<PolicyDocument> findRelevantPolicies(String query) {
        String lowerQuery = query.toLowerCase();
        return policyKnowledgeBase.stream()
                .filter(doc -> {
                    String combined = (doc.title() + " " + doc.category() + " " + doc.content()).toLowerCase();
                    // Match keywords such as shipping, delivery, return, refund, warranty, book, pay, hostel
                    return lowerQuery.contains("delivery") || lowerQuery.contains("hostel") ||
                            lowerQuery.contains("shipping") || lowerQuery.contains("return") ||
                            lowerQuery.contains("replace") || lowerQuery.contains("warranty") ||
                            lowerQuery.contains("repair") || lowerQuery.contains("buyback") ||
                            lowerQuery.contains("payment") || lowerQuery.contains("upi") ||
                            lowerQuery.contains("policy") || lowerQuery.contains("free") ||
                            combined.contains(lowerQuery);
                })
                .limit(2)
                .collect(Collectors.toList());
    }

    public List<PolicyDocument> getAllPolicies() {
        return policyKnowledgeBase;
    }
}
