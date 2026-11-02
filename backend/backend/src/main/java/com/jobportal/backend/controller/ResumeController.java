package com.jobportal.backend.controller;

import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.service.ResumeParserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "http://localhost:5173")
public class ResumeController {

    private final UserRepository userRepository;
    private final ResumeParserService resumeParserService;

    public ResumeController(UserRepository userRepository, ResumeParserService resumeParserService) {
        this.userRepository = userRepository;
        this.resumeParserService = resumeParserService;
    }

    @PostMapping("/upload/{userId}")
    public ResponseEntity<String> uploadResume(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {

        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            String filePath = resumeParserService.saveFile(file);
            String resumeText = resumeParserService.extractText(file);

            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                user.setResumePath(filePath);
                user.setResumeText(resumeText);
                userRepository.save(user);
            }

            return ResponseEntity.ok("Resume uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/view/{userId}")
    public ResponseEntity<byte[]> viewResume(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null || user.getResumePath() == null) {
                return ResponseEntity.notFound().build();
            }

            Path path = Paths.get(user.getResumePath());
            if (!Files.exists(path)) {
                return ResponseEntity.notFound().build();
            }

            byte[] file = Files.readAllBytes(path);
            String filename = path.getFileName().toString();
            String contentType = filename.toLowerCase().endsWith(".pdf")
                    ? "application/pdf"
                    : "application/octet-stream";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(file);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
