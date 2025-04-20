package com.uiktp.model.dtos;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CommentDTO {
    private String commentBody;
    private String studentEmail;
    public CommentDTO() {}

}
