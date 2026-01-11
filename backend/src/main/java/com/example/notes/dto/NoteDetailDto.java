package com.example.notes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoteDetailDto {
    private Long id;
    private String fileName;
    private LocalDateTime createdAt;
    private String summary;
    private List<Object> quizQuestions;
    private List<Object> flashcards;
}

