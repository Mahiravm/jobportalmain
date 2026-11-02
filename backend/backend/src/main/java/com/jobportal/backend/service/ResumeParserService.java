package com.jobportal.backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class ResumeParserService {

    private static final String UPLOAD_DIR = "uploads/resumes/";

    public String saveFile(MultipartFile file) throws Exception {
        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf";
        // Sanitize filename
        String safeName = originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
        String filePath = UPLOAD_DIR + System.currentTimeMillis() + "_" + safeName;
        Files.copy(file.getInputStream(), Paths.get(filePath));
        return filePath;
    }

    public String extractText(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return "";
        }
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        try {
            if (filename.endsWith(".pdf")) {
                return extractTextFromPdf(file.getBytes());
            } else if (filename.endsWith(".docx")) {
                return extractTextFromDocx(file.getInputStream());
            } else if (filename.endsWith(".txt")) {
                return new String(file.getBytes(), StandardCharsets.UTF_8);
            } else {
                // Try PDF first as fallback
                try {
                    return extractTextFromPdf(file.getBytes());
                } catch (Exception ex) {
                    return new String(file.getBytes(), StandardCharsets.UTF_8);
                }
            }
        } catch (Exception e) {
            System.err.println("Error extracting resume text: " + e.getMessage());
            return "";
        }
    }

    public String extractTextFromPath(String filePath) {
        if (filePath == null || filePath.trim().isEmpty()) {
            return "";
        }
        File file = new File(filePath);
        if (!file.exists()) {
            return "";
        }
        String lower = filePath.toLowerCase();
        try {
            if (lower.endsWith(".pdf")) {
                try (PDDocument document = Loader.loadPDF(file)) {
                    PDFTextStripper stripper = new PDFTextStripper();
                    return stripper.getText(document);
                }
            } else if (lower.endsWith(".docx")) {
                try (InputStream is = Files.newInputStream(file.toPath());
                     XWPFDocument doc = new XWPFDocument(is);
                     XWPFWordExtractor extractor = new XWPFWordExtractor(doc)) {
                    return extractor.getText();
                }
            } else {
                return Files.readString(file.toPath(), StandardCharsets.UTF_8);
            }
        } catch (Exception e) {
            System.err.println("Error reading resume from file path: " + e.getMessage());
            return "";
        }
    }

    public String extractTextFromPdf(byte[] pdfBytes) throws Exception {
        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    public String extractTextFromDocx(InputStream inputStream) throws Exception {
        try (XWPFDocument doc = new XWPFDocument(inputStream);
             XWPFWordExtractor extractor = new XWPFWordExtractor(doc)) {
            return extractor.getText();
        }
    }
}
