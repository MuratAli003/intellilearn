package com.example.notes.service;

import com.example.notes.config.FastApiConfig;
import com.example.notes.dto.NoteDetailDto;
import com.example.notes.dto.NoteSummaryDto;
import com.example.notes.model.Note;
import com.example.notes.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final RestTemplate restTemplate;
    private final FastApiConfig fastApiConfig;

    @Transactional
    public NoteDetailDto uploadPdf(MultipartFile file) {
        NoteDetailDto fastApiResult = sendFileToFastApi(file);

        if (fastApiResult == null) {
            throw new RuntimeException("FastAPI'den boş yanıt döndü.");
        }

        Note note = new Note();
        note.setFileName(file.getOriginalFilename());
        note.setSummary(fastApiResult.getSummary());
        note.setQuizQuestions(fastApiResult.getQuizQuestions());
        note.setFlashcards(fastApiResult.getFlashcards());
        note.setCreatedAt(LocalDateTime.now());

        note = noteRepository.save(note);

        fastApiResult.setId(note.getId());
        fastApiResult.setFileName(note.getFileName());

        return fastApiResult;
    }

    private NoteDetailDto sendFileToFastApi(MultipartFile file) {
        try {
            ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", fileResource);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<NoteDetailDto> response = restTemplate.postForEntity(
                    fastApiConfig.uploadPdfUrl(),
                    request,
                    NoteDetailDto.class
            );

            return response.getBody();

        } catch (IOException e) {
            throw new RuntimeException("Dosya okuma hatası: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("FastAPI entegrasyon hatası: " + e.getMessage());
        }
    }

    public List<NoteSummaryDto> getAllNotes() {
        return noteRepository.findAll().stream()
                .map(note -> new NoteSummaryDto(
                        note.getId(),
                        note.getFileName(),
                        note.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    public NoteDetailDto getNoteDetail(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not bulunamadı: " + id));

        NoteDetailDto dto = new NoteDetailDto();
        dto.setId(note.getId());
        dto.setFileName(note.getFileName());
        dto.setSummary(note.getSummary());
        dto.setQuizQuestions(note.getQuizQuestions());
        dto.setFlashcards(note.getFlashcards());

        return dto;
    }
}