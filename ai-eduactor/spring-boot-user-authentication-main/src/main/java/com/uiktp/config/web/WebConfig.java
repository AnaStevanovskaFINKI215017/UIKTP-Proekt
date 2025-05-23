package com.uiktp.config.web;

import org.hibernate.resource.jdbc.ResourceRegistry;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry){
        registry.addResourceHandler("/files/**")
                .addResourceLocations("file:uploads/");

        registry.addResourceHandler("/comments/files/**")
                .addResourceLocations("file:uploads/comments/");
    }
}
