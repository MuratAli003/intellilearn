package com.example.notes.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class FastApiConfig {

    @Value("${fastapi.base-url}")
    private String baseUrl;

    @Value("${fastapi.endpoint.upload-pdf}")
    private String uploadPdfEndpoint;

    @Value("${fastapi.endpoint.get-notes}")
    private String getNotesEndpoint;

    @Value("${fastapi.endpoint.get-note-detail}")
    private String getNoteDetailEndpoint;

    public String uploadPdfUrl() {
        return baseUrl + uploadPdfEndpoint;
    }

    public String getNotesUrl() {
        return baseUrl + getNotesEndpoint;
    }

    public String getNoteDetailUrl(Long id) {
        return baseUrl + getNoteDetailEndpoint.replace("{id}", id.toString());
    }
}
