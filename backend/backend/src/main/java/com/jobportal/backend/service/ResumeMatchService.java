//package com.jobportal.backend.service;
//
//import org.springframework.stereotype.Service;
//
//
//@Service
//public class ResumeMatchService {
//
//
//    public int calculateScore(
//            String resumeText,
//            String skills
//    ){
//
//
//        if(resumeText==null ||
//                skills==null)
//        {
//            return 0;
//        }
//
//
//        String resume =
//                resumeText.toLowerCase();
//
//
//        String[] required =
//                skills.toLowerCase()
//                        .split(",");
//
//
//        int matched=0;
//
//
//        for(String skill: required)
//        {
//
//            if(resume.contains(
//                    skill.trim()))
//            {
//                matched++;
//            }
//
//        }
//
//
//        return
//                (matched*100)
//                        /
//                        required.length;
//
//    }
//
//}



package com.jobportal.backend.service;

import org.springframework.stereotype.Service;

@Service
public class ResumeMatchService {

    public int calculateScore(String resumeText, String skills) {

        if (resumeText == null || skills == null || skills.trim().isEmpty()) {
            return 0;
        }

        String resume = resumeText.toLowerCase();

        // 🛠️ Fix லாஜிக்: கமா (,) அல்லது வெறும் ஸ்பேஸ் (\\s+) எது இருந்தாலும் பிரிச்சிடும்!
        String[] required = skills.toLowerCase().split(",|\\s+");

        int matched = 0;
        int validSkillsCount = 0;

        for (String skill : required) {
            String trimmedSkill = skill.trim();

            // காலியான ஸ்ட்ரிங் வராமல் இருக்க சின்ன செக்
            if (!trimmedSkill.isEmpty()) {
                validSkillsCount++;
                if (resume.contains(trimmedSkill)) {
                    matched++;
                }
            }
        }

        if (validSkillsCount == 0) {
            return 0;
        }

        return (matched * 100) / validSkillsCount;
    }
}