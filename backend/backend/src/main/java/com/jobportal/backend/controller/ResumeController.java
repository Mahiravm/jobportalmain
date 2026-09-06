package com.jobportal.backend.controller;

import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "http://localhost:5173")
public class ResumeController {

    private final UserRepository userRepository;

    public ResumeController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/upload/{userId}")
    public String uploadResume(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {

        try {
            String folder = "uploads/resumes/";
            File dir = new File(folder);
            if (!dir.exists()) dir.mkdirs();
            String filePath =
                    folder +
                            System.currentTimeMillis()
                            + "_"
                            + file.getOriginalFilename();
            Files.copy(file.getInputStream(), Paths.get(filePath));



            PDDocument document =
                    Loader.loadPDF(new File(filePath));


            PDFTextStripper stripper =
                    new PDFTextStripper();


            String resumeText =
                    stripper.getText(document);


            document.close();




            User user = userRepository.findById(userId).orElse(null);

            if (user != null) {
                user.setResumePath(filePath);
                user.setResumeText(resumeText);
                userRepository.save(user);
            }

            return "Resume uploaded successfully";

        } catch (Exception e) {
            return "Upload failed: " + e.getMessage();
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
            byte[] file = Files.readAllBytes(path);

            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .body(file);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}