package com.hospital.optimization.config;

import com.hospital.optimization.model.*;
import com.hospital.optimization.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private BedRepository bedRepository;

    @Autowired
    private PatientRegistrationRepository registrationRepository;

    @Autowired
    private QueueRepository queueRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeUsers();
        initializeDepartments();
        initializeBeds();
        initializeRegistrationsAndQueues();
    }

    private void initializeUsers() {
        if (userRepository.count() == 0) {
            System.out.println(">>> Initializing default hospital accounts...");

            // 1. ADMIN
            userRepository.save(User.builder()
                    .name("System Admin")
                    .email("admin@hospital.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .phone("+1 555-0101")
                    .role(UserRole.ADMIN)
                    .active(true)
                    .department("Administration")
                    .build());

            // 2. DOCTORS (Comprehensive Hospital Medical Staff)
            // Orthopedics
            userRepository.save(User.builder()
                    .name("Dr. Karan Bhatt")
                    .email("dr.karan@hospital.com")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .phone("+1 555-0106")
                    .role(UserRole.DOCTOR)
                    .active(true)
                    .specialization("Senior Joint Replacement & Knee Surgeon")
                    .department("Orthopedics")
                    .departmentId("ortho")
                    .roomNumber("C-204")
                    .cabin("C-204")
                    .available(true)
                    .currentQueueLength(3)
                    .build());

            userRepository.save(User.builder()
                    .name("Dr. Meera Nair")
                    .email("dr.meera@hospital.com")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .phone("+1 555-0112")
                    .role(UserRole.DOCTOR)
                    .active(true)
                    .specialization("Spine & Musculoskeletal Consultant")
                    .department("Orthopedics")
                    .departmentId("ortho")
                    .roomNumber("C-201")
                    .cabin("C-201")
                    .available(true)
                    .currentQueueLength(7)
                    .build());

            userRepository.save(User.builder()
                    .name("Dr. Sunita Rao")
                    .email("dr.sunita@hospital.com")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .phone("+1 555-0113")
                    .role(UserRole.DOCTOR)
                    .active(true)
                    .specialization("Sports Injuries & Arthroscopy")
                    .department("Orthopedics")
                    .departmentId("ortho")
                    .roomNumber("C-206")
                    .cabin("C-206")
                    .available(true)
                    .currentQueueLength(1)
                    .build());

            // Cardiology
            userRepository.save(User.builder()
                    .name("Dr. Sarah Jenkins")
                    .email("doctor@hospital.com")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .phone("+1 555-0102")
                    .role(UserRole.DOCTOR)
                    .active(true)
                    .specialization("Interventional Cardiologist")
                    .department("Cardiology")
                    .departmentId("cardio")
                    .roomNumber("OPD-302")
                    .cabin("OPD-302")
                    .available(true)
                    .currentQueueLength(4)
                    .build());

            userRepository.save(User.builder()
                    .name("Dr. Vikram Singhal")
                    .email("dr.vikram@hospital.com")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .phone("+1 555-0114")
                    .role(UserRole.DOCTOR)
                    .active(true)
                    .specialization("Cardiac Rhythm & Hypertension")
                    .department("Cardiology")
                    .departmentId("cardio")
                    .roomNumber("OPD-305")
                    .cabin("OPD-305")
                    .available(true)
                    .currentQueueLength(2)
                    .build());

            // Dermatology
            userRepository.save(User.builder()
                    .name("Dr. Priya Sharma")
                    .email("dr.priya@hospital.com")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .phone("+1 555-0107")
                    .role(UserRole.DOCTOR)
                    .active(true)
                    .specialization("Clinical Dermatologist & Allergist")
                    .department("Dermatology")
                    .departmentId("derma")
                    .roomNumber("A-101")
                    .cabin("A-101")
                    .available(true)
                    .currentQueueLength(3)
                    .build());

            userRepository.save(User.builder()
                    .name("Dr. Rahul Mehta")
                    .email("dr.rahul@hospital.com")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .phone("+1 555-0115")
                    .role(UserRole.DOCTOR)
                    .active(true)
                    .specialization("Acne & Laser Care Specialist")
                    .department("Dermatology")
                    .departmentId("derma")
                    .roomNumber("A-105")
                    .cabin("A-105")
                    .available(true)
                    .currentQueueLength(5)
                    .build());

            // General Medicine
            userRepository.save(User.builder()
                    .name("Dr. Amit Verma")
                    .email("dr.amit@hospital.com")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .phone("+1 555-0108")
                    .role(UserRole.DOCTOR)
                    .active(true)
                    .specialization("Senior Consultant Physician")
                    .department("General Medicine")
                    .departmentId("gen")
                    .roomNumber("G-102")
                    .cabin("G-102")
                    .available(true)
                    .currentQueueLength(4)
                    .build());

            userRepository.save(User.builder()
                    .name("Dr. Ritu Malhotra")
                    .email("dr.ritu@hospital.com")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .phone("+1 555-0116")
                    .role(UserRole.DOCTOR)
                    .active(true)
                    .specialization("Internal Medicine & Diabetologist")
                    .department("General Medicine")
                    .departmentId("gen")
                    .roomNumber("G-104")
                    .cabin("G-104")
                    .available(true)
                    .currentQueueLength(2)
                    .build());

            // Neurology
            userRepository.save(User.builder()
                    .name("Dr. Neha Gupta")
                    .email("dr.neha@hospital.com")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .phone("+1 555-0109")
                    .role(UserRole.DOCTOR)
                    .active(true)
                    .specialization("Neuro-Physician & Stroke Specialist")
                    .department("Neurology")
                    .departmentId("neuro")
                    .roomNumber("N-205")
                    .cabin("N-205")
                    .available(true)
                    .currentQueueLength(2)
                    .build());

            userRepository.save(User.builder()
                    .name("Dr. Tarun Saxena")
                    .email("dr.tarun@hospital.com")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .phone("+1 555-0117")
                    .role(UserRole.DOCTOR)
                    .active(true)
                    .specialization("Headache & Vertigo Consultant")
                    .department("Neurology")
                    .departmentId("neuro")
                    .roomNumber("N-208")
                    .cabin("N-208")
                    .available(true)
                    .currentQueueLength(4)
                    .build());

            // Ophthalmology
            userRepository.save(User.builder()
                    .name("Dr. Rajesh Iyer")
                    .email("dr.rajesh@hospital.com")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .phone("+1 555-0110")
                    .role(UserRole.DOCTOR)
                    .active(true)
                    .specialization("Cataract & Vision Care Consultant")
                    .department("Ophthalmology")
                    .departmentId("eye")
                    .roomNumber("E-103")
                    .cabin("E-103")
                    .available(true)
                    .currentQueueLength(2)
                    .build());

            // Pediatrics
            userRepository.save(User.builder()
                    .name("Dr. Anita Desai")
                    .email("dr.anita@hospital.com")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .phone("+1 555-0111")
                    .role(UserRole.DOCTOR)
                    .active(true)
                    .specialization("Senior Pediatrician & Neonatologist")
                    .department("Pediatrics")
                    .departmentId("ped")
                    .roomNumber("P-104")
                    .cabin("P-104")
                    .available(true)
                    .currentQueueLength(3)
                    .build());

            // Emergency
            userRepository.save(User.builder()
                    .name("Dr. Siddharth Kapoor")
                    .email("dr.siddharth@hospital.com")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .phone("+1 555-0118")
                    .role(UserRole.DOCTOR)
                    .active(true)
                    .specialization("Chief Emergency Trauma Consultant")
                    .department("Emergency")
                    .departmentId("emerg")
                    .roomNumber("ER-01")
                    .cabin("ER-01")
                    .available(true)
                    .currentQueueLength(1)
                    .build());

            // 3. NURSE
            userRepository.save(User.builder()
                    .name("Nurse Emily Carter")
                    .email("nurse@hospital.com")
                    .password(passwordEncoder.encode("Nurse@123"))
                    .phone("+1 555-0103")
                    .role(UserRole.NURSE)
                    .active(true)
                    .department("ICU Ward 2")
                    .build());

            // 4. RECEPTIONIST
            userRepository.save(User.builder()
                    .name("Michael Vance")
                    .email("receptionist@hospital.com")
                    .password(passwordEncoder.encode("Receptionist@123"))
                    .phone("+1 555-0104")
                    .role(UserRole.RECEPTIONIST)
                    .active(true)
                    .department("Front Desk")
                    .build());

            // 5. PATIENT
            userRepository.save(User.builder()
                    .name("John Doe")
                    .email("patient@hospital.com")
                    .password(passwordEncoder.encode("Patient@123"))
                    .phone("+1 555-0105")
                    .role(UserRole.PATIENT)
                    .active(true)
                    .gender("Male")
                    .dateOfBirth("1990-05-15")
                    .address("742 Evergreen Terrace, Springfield")
                    .emergencyContact("Jane Doe (+1 555-0999)")
                    .build());

            System.out.println(">>> Sample Users Initialized Successfully (ADMIN, DOCTORS, NURSE, RECEPTIONIST, PATIENT)");
        }
    }

    private void initializeDepartments() {
        if (departmentRepository.count() == 0) {
            departmentRepository.save(Department.builder().name("Cardiology").code("CARD").description("Heart & cardiovascular health").icon("Heart").totalBeds(30).activeQueues(4).doctorsCount(2).patientsToday(18).active(true).build());
            departmentRepository.save(Department.builder().name("Orthopedics").code("ORTHO").description("Bones, joints & musculoskeletal care").icon("Bone").totalBeds(25).activeQueues(5).doctorsCount(3).patientsToday(24).active(true).build());
            departmentRepository.save(Department.builder().name("Dermatology").code("DERMA").description("Skin, hair & allergy disorders").icon("Sparkles").totalBeds(15).activeQueues(3).doctorsCount(2).patientsToday(16).active(true).build());
            departmentRepository.save(Department.builder().name("General Medicine").code("GEN").description("Primary care, fevers & viral ailments").icon("Stethoscope").totalBeds(40).activeQueues(6).doctorsCount(4).patientsToday(35).active(true).build());
            departmentRepository.save(Department.builder().name("Neurology").code("NEURO").description("Brain, spinal & nervous system conditions").icon("Brain").totalBeds(20).activeQueues(2).doctorsCount(2).patientsToday(12).active(true).build());
            departmentRepository.save(Department.builder().name("Ophthalmology").code("EYE").description("Eye care & vision screening").icon("Eye").totalBeds(15).activeQueues(2).doctorsCount(2).patientsToday(14).active(true).build());
            departmentRepository.save(Department.builder().name("Pediatrics").code("PED").description("Infant, child & adolescent care").icon("Activity").totalBeds(25).activeQueues(3).doctorsCount(2).patientsToday(20).active(true).build());
            departmentRepository.save(Department.builder().name("Emergency").code("EMERG").description("24/7 Acute critical trauma & emergency care").icon("ShieldAlert").totalBeds(20).activeQueues(1).doctorsCount(3).patientsToday(8).active(true).build());
            System.out.println(">>> 8 Departments Initialized");
        }
    }

    private void initializeBeds() {
        if (bedRepository.count() == 0) {
            bedRepository.save(Bed.builder().bedNumber("ICU-101").wardName("ICU").department("Cardiology").status("OCCUPIED").assignedPatientName("Robert Paulson").updatedAt(LocalDateTime.now()).build());
            bedRepository.save(Bed.builder().bedNumber("ICU-102").wardName("ICU").department("Cardiology").status("AVAILABLE").updatedAt(LocalDateTime.now()).build());
            bedRepository.save(Bed.builder().bedNumber("ICU-103").wardName("ICU").department("Neurology").status("OCCUPIED").assignedPatientName("Elena Rostova").updatedAt(LocalDateTime.now()).build());
            bedRepository.save(Bed.builder().bedNumber("GEN-201").wardName("General Ward A").department("Orthopedics").status("OCCUPIED").assignedPatientName("Amit Patel").updatedAt(LocalDateTime.now()).build());
            bedRepository.save(Bed.builder().bedNumber("GEN-202").wardName("General Ward A").department("Orthopedics").status("AVAILABLE").updatedAt(LocalDateTime.now()).build());
            bedRepository.save(Bed.builder().bedNumber("GEN-203").wardName("General Ward B").department("General Medicine").status("AVAILABLE").updatedAt(LocalDateTime.now()).build());
            bedRepository.save(Bed.builder().bedNumber("GEN-204").wardName("General Ward B").department("General Medicine").status("MAINTENANCE").updatedAt(LocalDateTime.now()).build());
            bedRepository.save(Bed.builder().bedNumber("EMR-001").wardName("Emergency Ward").department("Emergency").status("AVAILABLE").updatedAt(LocalDateTime.now()).build());
            bedRepository.save(Bed.builder().bedNumber("EMR-002").wardName("Emergency Ward").department("Emergency").status("OCCUPIED").assignedPatientName("Vikram Singhania").updatedAt(LocalDateTime.now()).build());
            System.out.println(">>> Hospital Beds Initialized");
        }
    }

    private void initializeRegistrationsAndQueues() {
        if (registrationRepository.count() == 0) {
            System.out.println(">>> Initializing sample registrations & active queue tokens...");

            // Registration 1: Orthopedics (Amit Patel)
            PatientRegistration reg1 = registrationRepository.save(PatientRegistration.builder()
                    .name("Amit Patel")
                    .phone("9876543210")
                    .age(28)
                    .gender("Male")
                    .language("hi")
                    .rawComplaint("Mere ghutne mein ek hafte se bahut dard ho raha hai aur halki sujan hai.")
                    .mainSymptom("Joint / Knee / Musculoskeletal Pain")
                    .duration("1 week")
                    .severity("Moderate")
                    .associatedSymptoms("Swelling")
                    .extractedKeywords(List.of("Ghutna", "Joint Pain", "Sujan"))
                    .extractedDetails(Map.of("Main Symptom", "Joint/Knee Pain", "Duration", "1 hafte", "Severity", "Moderate", "Swelling", "Yes"))
                    .recommendedDepartment("Orthopedics")
                    .departmentId("ortho")
                    .routingConfidence("High")
                    .routingReason("Complaint relates to knee joint pain with swelling.")
                    .priority("Normal")
                    .emergency(false)
                    .doctorId("doc-ortho")
                    .doctorName("Dr. Karan Bhatt")
                    .cabin("C-204")
                    .tokenNumber("ORTHO-023")
                    .status("WAITING")
                    .createdAt(LocalDateTime.now().minusMinutes(25))
                    .build());

            queueRepository.save(QueueItem.builder()
                    .tokenNumber("ORTHO-023")
                    .registrationId(reg1.getId())
                    .patientId(reg1.getId())
                    .patientName("Amit Patel")
                    .age(28)
                    .gender("Male")
                    .complaint("Knee joint pain with swelling, 1 week")
                    .doctorId("doc-ortho")
                    .doctorName("Dr. Karan Bhatt")
                    .cabin("C-204")
                    .department("Orthopedics")
                    .departmentId("ortho")
                    .priority(1)
                    .priorityLabel("Normal")
                    .status("WAITING")
                    .queuePosition(3)
                    .estimatedWaitMinutes(18)
                    .createdAt(LocalDateTime.now().minusMinutes(25))
                    .build());

            // Queue item 1 for Ortho (Serving)
            queueRepository.save(QueueItem.builder()
                    .tokenNumber("ORTHO-021")
                    .patientName("Kiran Vora")
                    .age(41)
                    .gender("Female")
                    .complaint("Shoulder pain and stiff joint")
                    .doctorId("doc-ortho")
                    .doctorName("Dr. Karan Bhatt")
                    .cabin("C-204")
                    .department("Orthopedics")
                    .departmentId("ortho")
                    .priority(1)
                    .priorityLabel("Normal")
                    .status("IN_CONSULTATION")
                    .queuePosition(1)
                    .estimatedWaitMinutes(0)
                    .createdAt(LocalDateTime.now().minusMinutes(45))
                    .calledAt(LocalDateTime.now().minusMinutes(10))
                    .build());

            // Queue item 2 for Ortho (Waiting)
            queueRepository.save(QueueItem.builder()
                    .tokenNumber("ORTHO-022")
                    .patientName("Rahul Desai")
                    .age(34)
                    .gender("Male")
                    .complaint("Ankle twist during sports")
                    .doctorId("doc-ortho")
                    .doctorName("Dr. Karan Bhatt")
                    .cabin("C-204")
                    .department("Orthopedics")
                    .departmentId("ortho")
                    .priority(2)
                    .priorityLabel("Priority")
                    .status("WAITING")
                    .queuePosition(2)
                    .estimatedWaitMinutes(8)
                    .createdAt(LocalDateTime.now().minusMinutes(35))
                    .build());

            // Registration 2: Cardiology (Sarah Jenkins)
            PatientRegistration reg2 = registrationRepository.save(PatientRegistration.builder()
                    .name("Sanjay Kumar")
                    .phone("9876543211")
                    .age(54)
                    .gender("Male")
                    .language("hi")
                    .rawComplaint("Chest heaviness and mild palpitation after climbing stairs.")
                    .mainSymptom("Cardiovascular / Heart Concern")
                    .duration("3 days")
                    .severity("Moderate")
                    .associatedSymptoms("Palpitations")
                    .extractedKeywords(List.of("Chest Heaviness", "Palpitation"))
                    .extractedDetails(Map.of("Main Symptom", "Chest Heaviness", "Duration", "3 days", "Severity", "Moderate"))
                    .recommendedDepartment("Cardiology")
                    .departmentId("cardio")
                    .routingConfidence("High")
                    .routingReason("Cardiovascular symptoms requiring clinical cardiology evaluation.")
                    .priority("Priority")
                    .emergency(false)
                    .doctorId("doc-cardio")
                    .doctorName("Dr. Sarah Jenkins")
                    .cabin("OPD-302")
                    .tokenNumber("CARD-004")
                    .status("WAITING")
                    .createdAt(LocalDateTime.now().minusMinutes(20))
                    .build());

            queueRepository.save(QueueItem.builder()
                    .tokenNumber("CARD-004")
                    .registrationId(reg2.getId())
                    .patientId(reg2.getId())
                    .patientName("Sanjay Kumar")
                    .age(54)
                    .gender("Male")
                    .complaint("Chest heaviness on exertion, 3 days")
                    .doctorId("doc-cardio")
                    .doctorName("Dr. Sarah Jenkins")
                    .cabin("OPD-302")
                    .department("Cardiology")
                    .departmentId("cardio")
                    .priority(2)
                    .priorityLabel("Priority")
                    .status("WAITING")
                    .queuePosition(1)
                    .estimatedWaitMinutes(6)
                    .createdAt(LocalDateTime.now().minusMinutes(20))
                    .build());

            // Registration 3: Dermatology (Priya Sharma)
            PatientRegistration reg3 = registrationRepository.save(PatientRegistration.builder()
                    .name("Neha Joshi")
                    .phone("9876543212")
                    .age(29)
                    .gender("Female")
                    .language("en")
                    .rawComplaint("Red itchy rash on both arms for the past 4 days.")
                    .mainSymptom("Dermatological / Skin Issue")
                    .duration("4 days")
                    .severity("Mild")
                    .associatedSymptoms("Itching")
                    .extractedKeywords(List.of("Rash", "Itching", "Skin"))
                    .extractedDetails(Map.of("Main Symptom", "Skin Issue", "Duration", "4 days", "Severity", "Mild", "Itching", "Yes"))
                    .recommendedDepartment("Dermatology")
                    .departmentId("derma")
                    .routingConfidence("High")
                    .routingReason("Skin rash and pruritus.")
                    .priority("Normal")
                    .emergency(false)
                    .doctorId("doc-derma")
                    .doctorName("Dr. Priya Sharma")
                    .cabin("A-101")
                    .tokenNumber("DERMA-019")
                    .status("WAITING")
                    .createdAt(LocalDateTime.now().minusMinutes(15))
                    .build());

            queueRepository.save(QueueItem.builder()
                    .tokenNumber("DERMA-019")
                    .registrationId(reg3.getId())
                    .patientId(reg3.getId())
                    .patientName("Neha Joshi")
                    .age(29)
                    .gender("Female")
                    .complaint("Red itchy skin rash on arms")
                    .doctorId("doc-derma")
                    .doctorName("Dr. Priya Sharma")
                    .cabin("A-101")
                    .department("Dermatology")
                    .departmentId("derma")
                    .priority(1)
                    .priorityLabel("Normal")
                    .status("WAITING")
                    .queuePosition(1)
                    .estimatedWaitMinutes(5)
                    .createdAt(LocalDateTime.now().minusMinutes(15))
                    .build());

            // Registration 4: General Medicine (Dr. Amit Verma)
            PatientRegistration reg4 = registrationRepository.save(PatientRegistration.builder()
                    .name("Priyanka Iyer")
                    .phone("9876543213")
                    .age(38)
                    .gender("Female")
                    .language("hi")
                    .rawComplaint("Tez bukhar aur sardi 3 din se hai, gala bhi dard kar raha hai.")
                    .mainSymptom("General / Viral Symptoms")
                    .duration("3 days")
                    .severity("Moderate")
                    .associatedSymptoms("Sore Throat")
                    .extractedKeywords(List.of("Bukhar", "Fever", "Gala"))
                    .extractedDetails(Map.of("Main Symptom", "Fever", "Duration", "3 din", "Severity", "Moderate"))
                    .recommendedDepartment("General Medicine")
                    .departmentId("gen")
                    .routingConfidence("High")
                    .routingReason("Viral symptoms and fever.")
                    .priority("Normal")
                    .emergency(false)
                    .doctorId("doc-gen")
                    .doctorName("Dr. Amit Verma")
                    .cabin("G-102")
                    .tokenNumber("GEN-012")
                    .status("WAITING")
                    .createdAt(LocalDateTime.now().minusMinutes(10))
                    .build());

            queueRepository.save(QueueItem.builder()
                    .tokenNumber("GEN-012")
                    .registrationId(reg4.getId())
                    .patientId(reg4.getId())
                    .patientName("Priyanka Iyer")
                    .age(38)
                    .gender("Female")
                    .complaint("Fever and sore throat, 3 days")
                    .doctorId("doc-gen")
                    .doctorName("Dr. Amit Verma")
                    .cabin("G-102")
                    .department("General Medicine")
                    .departmentId("gen")
                    .priority(1)
                    .priorityLabel("Normal")
                    .status("WAITING")
                    .queuePosition(1)
                    .estimatedWaitMinutes(4)
                    .createdAt(LocalDateTime.now().minusMinutes(10))
                    .build());

            // Sample Appointment
            appointmentRepository.save(Appointment.builder()
                    .patientName("John Doe")
                    .patientId("pat-101")
                    .doctorName("Dr. Sarah Jenkins")
                    .doctorId("doc-cardio")
                    .department("Cardiology")
                    .appointmentTime(LocalDateTime.now().plusHours(2))
                    .status("SCHEDULED")
                    .reason("Annual cardiac checkup and ECG")
                    .notes("Patient requested morning slot")
                    .build());

            System.out.println(">>> Sample Patient Registrations & Queues Created Successfully");
        }
    }
}
