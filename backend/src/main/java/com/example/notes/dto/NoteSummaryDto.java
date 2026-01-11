package com.example.notes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoteSummaryDto {
    private Long id;
    private String fileName;
    private LocalDateTime createdAt;
}

